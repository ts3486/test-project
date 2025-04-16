import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import ArticleCard from '../components/ArticleCard';

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export const HomeScreen = () => {
  const { user, getAccessToken } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      console.log('Fetching articles with token:', token.substring(0, 10) + '...');
      
      // For development on iOS simulator, use your machine's IP address instead of localhost
      const API_URL = 'http://10.0.2.2:3000/api/articles'; // For Android emulator
      // const API_URL = 'http://localhost:3000/api/articles'; // For iOS simulator
      
      console.log('Making request to:', API_URL);

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch articles: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received articles:', data.length);
      setArticles(data);
      setError(null);
    } catch (err) {
      console.error('Detailed error fetching articles:', err);
      setError('Failed to load articles. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchArticles();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>News Feed</Text>
        <Text style={styles.welcomeText}>Welcome, {user?.name || 'User'}</Text>
      </View>
      
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={fetchArticles}>
            Tap to retry
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.feed}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {articles.length > 0 ? (
            articles.map((article) => (
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
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