import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Article {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  summary?: string;
  tags: string[];
  imageUrl?: string;
}

interface ArticleCardProps {
  article: Article;
}

const { height: viewportHeight } = Dimensions.get('window');
const CARD_HEIGHT = viewportHeight * 0.5;

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Image Section with Overlay */}
        <View style={styles.imageContainer}>
          {!imageError && article.imageUrl ? (
            <Image
              source={{ uri: article.imageUrl }}
              style={styles.image}
              onError={handleImageError}
            />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>No Image Available</Text>
            </View>
          )}
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.5, 1]}
            style={styles.gradient}
          >
            {/* Title */}
            <Text style={styles.title} numberOfLines={1}>
              {article.title}
            </Text>

            {/* Description and Metadata */}
            <View style={styles.overlayContent}>
              <View style={styles.metadata}>
                <Text style={styles.source}>{article.source}</Text>
                <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
              </View>

              <Text 
                style={styles.description}
                numberOfLines={showFullDescription ? undefined : 2}
              >
                {article.summary || article.content}
              </Text>

              {!showFullDescription && (
                <Text style={styles.readMore} onPress={toggleDescription}>
                  Read More
                </Text>
              )}

              <View style={styles.tagsContainer}>
                {article.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingBottom: 20,
  },
  container: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: '#1a1a1a',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overlayContent: {
    width: '100%',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  source: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    color: '#999',
    fontSize: 12,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ArticleCard; 