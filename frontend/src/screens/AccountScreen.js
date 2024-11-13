import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';


const AccountScreen = ({ route }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);  // Set email if passed from TabNavigator
    }
  }, [route.params]);
  return (
    <View style={styles.container}>
      {/* Static Profile Information */}
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/profile_placeholder.png')} style={styles.profilePicture} />
        <Text style={styles.userName}>'Loading...'</Text>
        <Text style={styles.userEmail}> {email || 'Loading email...'}</Text>
      </View>

{/* Scrollable Sections */}
<ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Favorite Places Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Favorite Places</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.noFavorites}>No favorite places added yet.</Text>
          </View>
        </View>

        {/* Saved Restaurants Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Saved Restaurants</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.noFavorites}>No saved restaurants yet.</Text>
          </View>
        </View>

        {/* Visited Places Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Visited Places</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.noFavorites}>No visited places yet.</Text>
          </View>
        </View>

        {/* My Reviews Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>My Reviews</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.noFavorites}>No reviews written yet.</Text>
          </View>
        </View>

        {/* Dining Preferences Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Dining Preferences</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.noFavorites}>No dining preferences set.</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ffaa00',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffaa00',
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: '#ffaa00',
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    backgroundColor: '#f5f5f5', 
    padding: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  noFavorites: {
    fontSize: 16,
    color: '#999',
  },
});

export default AccountScreen;
