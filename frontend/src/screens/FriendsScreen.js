import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';

const FriendsScreen = () => {
  const [activeTab, setActiveTab] = useState('friends'); 

  // Dummy data for Friends and Suggested Friends
  const friends = [
    { name: 'John', email: 'john@example.com', location: 'New York', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Jane', email: 'jane@example.com', location: 'Los Angeles', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Sarah', email: 'sarah@example.com', location: 'Chicago', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Mike', email: 'mike@example.com', location: 'San Francisco', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  ];

  const suggestedFriends = [
    { name: 'Alex', email: 'alex@example.com', location: 'Miami', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Chris', email: 'chris@example.com', location: 'Austin', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { name: 'Olivia', email: 'olivia@example.com', location: 'Seattle', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { name: 'Emma', email: 'emma@example.com', location: 'Boston', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Tab Navigation */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'friends' && styles.activeTabButton]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'suggested' && styles.activeTabButton]}
          onPress={() => setActiveTab('suggested')}
        >
          <Text style={[styles.tabText, activeTab === 'suggested' && styles.activeTabText]}>Suggested</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {activeTab === 'friends' ? (
          <>
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <View key={index} style={styles.friendItemContainer}>
                  <Image source={{ uri: friend.image }} style={styles.profilePicture} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendEmail}>{friend.email}</Text>
                    <Text style={styles.friendLocation}>{friend.location}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noFriendsText}>No friends yet.</Text>
            )}
          </>
        ) : (
          <>
            {suggestedFriends.length > 0 ? (
              suggestedFriends.map((friend, index) => (
                <View key={index} style={styles.friendItemContainer}>
                  <Image source={{ uri: friend.image }} style={styles.profilePicture} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendEmail}>{friend.email}</Text>
                    <Text style={styles.friendLocation}>{friend.location}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noFriendsText}>No suggested friends yet.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ffaa00',
    marginBottom: 0,
  },
  tabButton: {
    flex: 1,  
    paddingVertical: 12, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#ff6f00',
  },
  tabText: {
    fontSize: 18,
    color: '#333',
  },
  activeTabText: {
    color: '#ff6f00',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  friendItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: '100%',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  friendEmail: {
    fontSize: 14,
    color: '#666',
  },
  friendLocation: {
    fontSize: 14,
    color: '#999',
  },
  noFriendsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default FriendsScreen;
