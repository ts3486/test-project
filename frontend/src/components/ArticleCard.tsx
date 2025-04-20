import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  imageURL?: string;
  satiricalSummary?: string;
  satiricalImageURL?: string;
}

interface ArticleCardProps {
  article: Article;
}

const { height: viewportHeight } = Dimensions.get('window');
const CARD_HEIGHT = viewportHeight * 0.5;

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSatirical, setShowSatirical] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleImageError = (error: any) => {
    console.log('Image error:', error);
    setImageError(true);
    setImageLoading(false);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const toggleView = () => {
    setShowSatirical(!showSatirical);
    // Reset loading state when toggling between images
    setImageLoading(true);
    setImageError(false);
  };

  const currentImageUrl = showSatirical ? article.satiricalImageURL : article.imageURL;
  const currentSummary = showSatirical ? article.satiricalSummary : (article.summary || article.content);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', currentImageUrl);
    setImageLoading(false);
    setImageError(false);
  };

  // Reset loading state when the article changes
  React.useEffect(() => {
    console.log('Article changed:', {
      articleId: article.id,
      currentImageUrl,
      imageLoading,
      imageError
    });
    setImageLoading(true);
    setImageError(false);
  }, [article.id, currentImageUrl]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {imageLoading && !currentImageUrl && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
          
          {currentImageUrl && !imageError ? (
            <Image
              source={{ uri: currentImageUrl }}
              style={styles.image}
              onError={handleImageError}
              onLoad={handleImageLoad}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>No Image Available</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title} numberOfLines={1}>
            {article.title}
          </Text>

          <View style={styles.metadata}>
            <Text style={styles.source}>{article.source}</Text>
            <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
          </View>

          <Text 
            style={styles.description}
            numberOfLines={showFullDescription ? undefined : 2}
          >
            {currentSummary}
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

          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleView}
          >
            <Text style={styles.toggleButtonText}>
              {showSatirical ? 'Show Original' : 'Show Satirical Version'}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageSection: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 2,
  },
  noImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },
  contentSection: {
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
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
    marginBottom: 8,
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
  toggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ArticleCard; 