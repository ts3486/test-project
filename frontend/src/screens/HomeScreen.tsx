import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      content
      author {
        name
      }
    }
  }
`;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { loading, error, data } = useQuery(GET_ARTICLES);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate('Article', { id: item.id })}
    >
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleAuthor}>By {item.author.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  articleItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  articleAuthor: {
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
}); 