import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import ArticleCard from '../components/ArticleCard';
import { gql, useQuery } from '@apollo/client';

const GET_ARTICLES = gql`
  query GetArticles($limit: Int, $offset: Int) {
    articles(limit: $limit, offset: $offset) {
      id
      title
      content
      summary
      source
      url
      publishedAt
      tags
    }
  }
`;

interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  source: string;
  url: string;
  publishedAt: string;
  tags: string[];
}

export const HomeScreen = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_ARTICLES, {
    variables: { limit: 10, offset: 0 },
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('GraphQL Error:', error);
      setErrorMessage(error.message);
    },
  });

  useEffect(() => {
    console.log('HomeScreen mounted');
    console.log('Current user:', user);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
    console.log('Data:', data);
  }, [user, loading, error, data]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setErrorMessage(null);
    refetch()
      .catch((error) => {
        console.error('Refresh error:', error);
        setErrorMessage(error.message);
      })
      .finally(() => setRefreshing(false));
  }, [refetch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>News Feed</Text>
        <Text style={styles.welcomeText}>Welcome, {user?.name || 'User'}</Text>
      </View>
      
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      ) : error || errorMessage ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMessage || error?.message}</Text>
          <Text style={styles.retryText} onPress={onRefresh}>
            Tap to retry
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.feed}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        >
          {data?.articles?.length > 0 ? (
            data.articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No articles available</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  feed: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
}); 