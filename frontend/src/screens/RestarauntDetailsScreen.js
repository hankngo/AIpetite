import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        // Check if the restaurant details are cached
        const cachedData = await AsyncStorage.getItem(`restaurant_${restaurantId}`);
        if (cachedData) {
          setRestaurant(JSON.parse(cachedData));
          setLoading(false);
          console.log('Loaded restaurant details from cache');
        } else {
          // Fetch restaurant details from the backend
          const response = await axios.get(`http://172.20.10.2:5001/restaurant/${restaurantId}`);
          setRestaurant(response.data);
          setLoading(false);

          // Cache the restaurant details
          await AsyncStorage.setItem(`restaurant_${restaurantId}`, JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

 const saveRestaurant = async () => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    console.log('User ID:', userId); 

    if (!restaurant || !restaurant.name || !restaurant.location || !restaurantId) {
      Alert.alert('Error', 'Invalid restaurant data');
      return;
    }

    

    const response = await axios.post('http://172.20.10.2:5001/save-restaurant', {
      userId,
      restaurantId,
      name: restaurant.name,
      location: restaurant.location,
    });

    if (response.status === 200) {
      Alert.alert('Success', 'Restaurant saved successfully');
    } else {
      Alert.alert('Error', 'Failed to save restaurant. Please try again.');
    }
  } catch (error) {
    console.error('Error saving restaurant:', error);
    if (error.response) {
      console.error('Server responded with:', error.response.data);
    }
    Alert.alert('Error', 'Failed to save restaurant. Please try again.');
  }
};


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffaa00" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading restaurant details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.photoUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.description}>{restaurant.description}</Text>
        <TouchableOpacity
          style={styles.websiteButton}
          onPress={() => Linking.openURL(restaurant.website)}
        >
          <Text style={styles.websiteButtonText}>View Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveRestaurant}
        >
          <Text style={styles.saveButtonText}>Save Restaurant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
  },
  image: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  websiteButton: {
    backgroundColor: '#ffaa00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  websiteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#ffaa00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantDetailsScreen;