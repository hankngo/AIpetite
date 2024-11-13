import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';

const HomeScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check if email is passed via navigation params
    if (route.params?.email) {
      setEmail(route.params.email); // Set email if passed
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>Welcome, {email}!</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Image source={require('../../assets/images/search_icon.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Restaurants"
            placeholderTextColor="#888"
          />
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.recommendButton}
        onPress={() => navigation.navigate('Recommend')}
      >
        <Text style={styles.recommendButtonText}>Get a Recommendation</Text>
      </TouchableOpacity>

      <Text style={styles.recommendationText}>Feeling Adventurous? You Might Like:</Text>


      <ScrollView style={styles.restaurantList}>
        <View style={styles.restaurantBox}>
          <Image source={require('../../assets/images/bagel.png')} style={styles.restaurantImage} />
          <Text style={styles.restaurantInfo}>Eswar's Bagels</Text>
          <Text style={styles.restaurantInfo}>★ 4.8 • 0.1 miles away • 15 reviews</Text>
        </View>
        <View style={styles.restaurantBox}>
          <Image source={require('../../assets/images/sample_restaurant.png')} style={styles.restaurantImage} />
          <Text style={styles.restaurantInfo}>Jose's Hotdogs</Text>
          <Text style={styles.restaurantInfo}>★ 4.2 • 2.7 miles away • 20 reviews</Text>
        </View>
        <View style={styles.restaurantBox}>
          <Image source={require('../../assets/images/krusty_krab.png')} style={styles.restaurantImage} />
          <Text style={styles.restaurantInfo}>Krusty Krab</Text>
          <Text style={styles.restaurantInfo}>★ 2.0 • 3.2 miles away • 5 reviews</Text>
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
  topSection: {
    marginTop: 20,
    marginLeft: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#ffaa00', 
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000',
  },
  recommendationText: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantList: {
    marginTop: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  restaurantBox: {
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    borderColor: '#ffaa00',
    borderWidth: 2,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 225,
    resizeMode: 'stretch',
  },
  restaurantInfo: {
    padding: 5,
    fontSize: 14,
    color: '#666',
  },
  recommendButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ffaa00',
    borderRadius: 10,
    alignItems: 'center',
  },
  recommendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
