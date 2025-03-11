import React, { useEffect, useState } from 'react';
import {
    Appearance,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, []);

  // Sample data
  const stories = [
    { id: '1', username: 'jolly_doe', avatar: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=', hasStory: true },
    { id: '2', username: 'jane_smith', avatar: 'https://via.placeholder.com/80', hasStory: false },
    { id: '3', username: 'mike_123', avatar: 'https://via.placeholder.com/80', hasStory: true },
  ];

  const posts = [
    {
      id: '1',
      username: 'jolly_doe',
      avatar: 'https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHMDlwRCHOHZP_tX7jRYNxV8W8MpNEog45w&s',
      likes: 1245,
      caption: 'Exploring new horizons 🌅 #travel #nature',
      timestamp: '2h ago',
      isLiked: false,
    },
    {
      id: '2',
      username: 'jane_smith',
      avatar: 'https://via.placeholder.com/32',
      image: 'https://via.placeholder.com/400',
      likes: 892,
      caption: 'Coffee time! ☕ #morningroutine',
      timestamp: '4h ago',
      isLiked: true,
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Simulate refresh
  };

  // Story Item Component
  const StoryItem = ({ item }) => (
    <TouchableOpacity style={styles.storyContainer}>
      <View style={[
        styles.storyImageContainer,
        item.hasStory && styles.storyBorder(isDarkMode),
      ]}>
        <Image source={{ uri: item.avatar }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyUsername(isDarkMode)} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  // Post Item Component
  const PostItem = ({ item }) => (
    <View style={styles.postContainer(isDarkMode)}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.profileImage} />
        <Text style={styles.username(isDarkMode)}>{item.username}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon(isDarkMode)}>⋯</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.postFooter}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon(isDarkMode, item.isLiked)}>
              {item.isLiked ? '❤️' : '♡'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon(isDarkMode)}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon(isDarkMode)}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Text style={styles.actionIcon(isDarkMode)}>🔖</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postContent}>
          <Text style={styles.likes(isDarkMode)}>{item.likes.toLocaleString()} likes</Text>
          <Text style={styles.caption(isDarkMode)}>
            <Text style={styles.username(isDarkMode)}>{item.username} </Text>
            {item.caption}
          </Text>
          <Text style={styles.timestamp(isDarkMode)}>{item.timestamp}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header(isDarkMode)}>
        <TouchableOpacity>
          <Text style={styles.headerIcon(isDarkMode)}>📷</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle(isDarkMode)}>Instagram</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIcon(isDarkMode)}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.headerIcon(isDarkMode)}>✉️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={styles.storiesContainer(isDarkMode)}>
            <FlatList
              data={stories}
              renderItem={StoryItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }
        data={posts}
        renderItem={PostItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#fff' : '#000'}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: isDarkMode => ({
    flex: 1,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  }),
  header: isDarkMode => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#dbdbdb',
  }),
  headerTitle: isDarkMode => ({
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
  }),
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: isDarkMode => ({
    marginHorizontal: 10,
    fontSize: 24,
    color: isDarkMode ? '#fff' : '#000',
  }),
  storiesContainer: isDarkMode => ({
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#333' : '#dbdbdb',
  }),
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  storyImageContainer: {
    padding: 2,
  },
  storyBorder: isDarkMode => ({
    borderRadius: 38,
    borderWidth: 2,
    borderColor: isDarkMode ? '#fff' : '#ff8501',
  }),
  storyImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#ccc',
  },
  storyUsername: isDarkMode => ({
    marginTop: 4,
    fontSize: 12,
    color: isDarkMode ? '#fff' : '#000',
    textAlign: 'center',
  }),
  postContainer: isDarkMode => ({
    marginBottom: 15,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  }),
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  username: isDarkMode => ({
    fontWeight: '600',
    color: isDarkMode ? '#fff' : '#000',
  }),
  moreButton: {
    marginLeft: 'auto',
  },
  moreIcon: isDarkMode => ({
    fontSize: 20,
    color: isDarkMode ? '#fff' : '#000',
  }),
  postImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#eee',
  },
  postFooter: {
    padding: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    marginRight: 15,
  },
  bookmarkButton: {
    marginLeft: 'auto',
  },
  actionIcon: (isDarkMode, isLiked) => ({
    fontSize: 24,
    color: isLiked ? '#ed4956' : isDarkMode ? '#fff' : '#000',
  }),
  postContent: {
    paddingTop: 2,
  },
  likes: isDarkMode => ({
    fontWeight: '600',
    marginBottom: 6,
    color: isDarkMode ? '#fff' : '#000',
  }),
  caption: isDarkMode => ({
    marginBottom: 6,
    color: isDarkMode ? '#fff' : '#000',
  }),
  timestamp: isDarkMode => ({
    fontSize: 12,
    color: isDarkMode ? '#888' : '#666',
  }),
});

export default HomeScreen;