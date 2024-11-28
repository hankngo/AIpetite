import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const maxVisible = 2; 
const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const AccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState(''); 
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({ restaurants_id: '', restaurant_name: '', location: '' });  
  const [modalVisible, setModalVisible] = useState(false);
  const [showFullList, setShowFullList] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedName = await AsyncStorage.getItem('name');
        const storedUserId = await AsyncStorage.getItem('user_id');
        setName(storedName || 'No name found');
        setEmail(storedEmail || 'No email found');
        setUserId(storedUserId || '');
  
        // Fetch visited places
        if (storedUserId) {
          const response = await axios.get(`http://localhost:5001/visited-places/${storedUserId}`);
          setVisitedPlaces(response.data.restaurants || []);
        }
      } catch (error) {
        console.error('Error fetching visited places:', error);
      }
    };
  
    fetchUserData();
  }, []);

  const addVisitedPlace = async () => {
    // Generate a random ID for the restaurant
    const randomId = generateRandomId();
    const updatedPlace = {
      ...newPlace,
      restaurants_id: randomId, // Add the random ID
    };

    try {
      const updatedPlaces = [...visitedPlaces, updatedPlace];

      // Update the backend with the new restaurant data
      await axios.post(`http://localhost:5001/visited-places/${userId}`, {
        user_id: userId,
        restaurants: updatedPlaces,
      });

      // Update the local state
      setVisitedPlaces(updatedPlaces);
      setModalVisible(false);
      setNewPlace({ restaurant_name: '', location: '' });
    } catch (error) {
      console.error('Error adding visited place:', error);
      Alert.alert('Error', 'Failed to add place. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Static Profile Information */}
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/profile_placeholder.png')} style={styles.profilePicture} />
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}> {email}</Text>
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
  <View style={styles.headerRow}>
    <Text style={styles.sectionHeader}>Visited Places ({visitedPlaces.length})</Text>
    <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.6}>
      <Image
        source={require('../../assets/images/add_icon.png')}
        style={styles.addIcon}
      />
    </TouchableOpacity>
  </View>
  <View style={styles.contentContainer}>
    {visitedPlaces.length > 0 ? (
      visitedPlaces.slice(0, showFullList ? visitedPlaces.length : maxVisible).map((place, index) => (
        <View key={index} style={styles.listItemContainer}>
          <Text style={styles.contentNameText}>{place.restaurant_name}</Text>
          <Text style={styles.contentLocationText}>{place.location}</Text>
          {index < visitedPlaces.length - 1 && <View style={styles.divider} />}
        </View>
      ))
    ) : (
      <Text style={styles.noFavorites}>No visited places yet.</Text>
    )}

    {/* Toggle Button */}
    {visitedPlaces.length > maxVisible && (
      <TouchableOpacity onPress={() => setShowFullList(!showFullList)}>
        <Text style={styles.toggleText}>
          {showFullList ? 'Show Less' : 'Show More'}
        </Text>
      </TouchableOpacity>
    )}
  </View>
</View>

        {/* Modal for Adding a New Place */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Add Visited Place</Text>
              <TextInput
                style={styles.input}
                placeholder="Restaurant Name"
                value={newPlace.restaurant_name}
                onChangeText={(text) => setNewPlace({ ...newPlace, restaurant_name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={newPlace.location}
                onChangeText={(text) => setNewPlace({ ...newPlace, location: text })}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.button}>
                  <Text style={styles.buttonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addVisitedPlace} style={styles.button}>
                  <Text style={styles.buttonTextAdd}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ffaa00',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 0,      
  },
  addIcon: {
    width: 20,                 
    height: 20,                    
    marginRight: 20,                 
    tintColor: '#fff',              
  },
  contentContainer: {
    backgroundColor: '#f5f5f5', 
    padding: 10,
  },
  contentNameText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  contentLocationText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  noFavorites: {
    fontSize: 16,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffaa00',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  button: {
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonTextCancel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'lightcoral',
  },
  buttonTextAdd: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  listItemContainer: {
    paddingHorizontal: 0,
  },
  divider: {
    height: 1, 
    backgroundColor: '#ccc', 
    marginVertical: 5, 
    alignSelf: 'stretch', 
  },
  toggleText: {
    color: '#ffaa00',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeContainer: {
    marginBottom: 10, 
  },
});

export default AccountScreen;
