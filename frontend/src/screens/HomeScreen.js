import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [foodType, setFoodType] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(1500);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [openMinRating, setOpenMinRating] = useState(false);
  const [openMaxDistance, setOpenMaxDistance] = useState(false);

  const minRatingOptions = [
    { label: 'Any', value: 1 },
    { label: '3+ Stars', value: 3 },
    { label: '4+ Stars', value: 4 },
  ];

  const maxDistanceOptions = [
    { label: '1 mile', value: 1609 },
    { label: '5 miles', value: 8047 },
    { label: '10 miles', value: 16093 },
    { label: '15 miles', value: 24140 },
    { label: '20 miles', value: 32186 },
  ];

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

        const response = await axios.post('http://192.168.1.67:5001/nearby-restaurants', { 
          latitude, 
          longitude, 
          foodType, 
          minPrice: 0, 
          maxPrice: 4, 
          minRating, 
          maxDistance 
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        Alert.alert('Error', 'Unable to fetch nearby restaurants. Please try again.');
      }
    };

    fetchUserData();
    fetchNearbyRestaurants();
  }, [route.params, foodType, minRating, maxDistance]);

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
            onChangeText={setFoodType}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filter Options</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter Options</Text>

            <Text style={styles.filterLabel}>Minimum Rating:</Text>
            <DropDownPicker
              open={openMinRating}
              value={minRating}
              items={minRatingOptions}
              setOpen={setOpenMinRating}
              setValue={setMinRating}
              setItems={() => {}}
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer}
              zIndex={1000}
            />

            <Text style={styles.filterLabel}>Maximum Distance:</Text>
            <DropDownPicker
              open={openMaxDistance}
              value={maxDistance}
              items={maxDistanceOptions}
              setOpen={setOpenMaxDistance}
              setValue={setMaxDistance}
              setItems={() => {}}
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer2}
              zIndex={900}
            />

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.recommendButton}
        onPress={() => navigation.navigate('Recommend')}
      >
        <Text style={styles.recommendButtonText}>Get a Recommendation</Text>
      </TouchableOpacity>

      <Text style={styles.recommendationText}>Nearby Restaurants:</Text>

      <ScrollView style={styles.restaurantList}>
        {restaurants.map((restaurant, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: restaurant.place_id })}>
            <View style={styles.restaurantBox}>
              <Image source={{ uri: restaurant.photoUrl }} style={styles.restaurantImage} />
              <Text style={styles.restaurantInfo}>{restaurant.name}</Text>
              <Text style={styles.restaurantInfo}>★ {restaurant.rating} • {restaurant.vicinity}</Text>
            </View>
          </TouchableOpacity>
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
  filterButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ffaa00',
    borderRadius: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    marginBottom: 20,
  },
  dropDownContainer: {
    marginBottom: 20,
    opacity: 0.9,
    zIndex: 1001,
  },
  dropDownContainer2: {
    zIndex: 1000,
    marginBottom: 20,
    opacity: 0.9,
  },
  applyButton: {
    backgroundColor: '#ffaa00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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