import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = JSON.parse(await AsyncStorage.getItem('name')); 
        const storedEmail = JSON.parse(await AsyncStorage.getItem('email')); 
        
        setName(storedName || 'No name found');
        setEmail(route.params?.email || storedEmail || 'No email found');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchNearbyRestaurants = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch nearby restaurants.');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = location.coords;

        const response = await axios.post('http://192.168.1.67:5001/nearby-restaurants', { latitude, longitude });
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        Alert.alert('Error', 'Unable to fetch nearby restaurants. Please try again.');
      }
    };

    fetchUserData();
    fetchNearbyRestaurants();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>Welcome, {name}!</Text>
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

      <Text style={styles.recommendationText}>Nearby Restaurants:</Text>

      <ScrollView style={styles.restaurantList}>
        {restaurants.map((restaurant, index) => (
          <View key={index} style={styles.restaurantBox}>
            <Image id='imagecontainer' source={{ uri: restaurant.photoUrl }} style={styles.restaurantImage} />
            <Text style={styles.restaurantInfo}>{restaurant.name}</Text>
            <Text style={styles.restaurantInfo}>★ {restaurant.rating} • {restaurant.vicinity}</Text>
          </View>
        ))}
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
    padding: 10,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  restaurantInfo: {
    padding: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
