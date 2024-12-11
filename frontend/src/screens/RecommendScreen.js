import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RecommendScreen = ({ navigation }) => {
  const [diet, setDiet] = useState('None');
  const [serviceType, setServiceType] = useState('Any');
  const [mealType, setMealType] = useState('Any');
  const [distance, setDistance] = useState('Any');
  const [rating, setRating] = useState('Any');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [options, setOptions] = useState([]);

  const openModal = (pickerKey, optionsList) => {
    setCurrentPicker(pickerKey);
    setOptions(optionsList);
    setIsModalVisible(true);
  };

  const handleSelection = (value) => {
    switch (currentPicker) {
      case 'diet':
        setDiet(value);
        break;
      case 'serviceType':
        setServiceType(value);
        break;
      case 'mealType':
        setMealType(value);
        break;
      case 'distance':
        setDistance(value);
        break;
      case 'rating':
        setRating(value);
        break;
      default:
        break;
    }
    setIsModalVisible(false);
  };

  const savePreferences = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const preferencesData = {
        userId,
        diet,
        serviceType,
        mealType,
        distance,
        rating,
      };

      console.log('Sending preferences data to backend:', preferencesData);

      const response = await axios.post('http:/172.20.10.2:5001/save-preferences', preferencesData);

      if (response.status === 200) {
        Alert.alert('Success', 'Preferences saved successfully');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    }
  };

  const SelectionOption = ({ label, value, selectedValue, options, pickerKey }) => (
    <View style={styles.selectionContainer}>
      <Text style={styles.selectionLabel}>{label}</Text>
      <TouchableOpacity style={styles.textBox} onPress={() => openModal(pickerKey, options)}>
        <Text style={styles.textBoxText}>{selectedValue}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Let's Set Your Preferences:</Text>

        <SelectionOption
          label="Dietary Preference"
          value={diet}
          selectedValue={diet}
          options={[
            { label: "None", value: "None" },
            { label: "Vegan", value: "Vegan" },
            { label: "Vegetarian", value: "Vegetarian" },
            { label: "Pescatarian", value: "Pescatarian" },
            { label: "Keto", value: "Keto" },
          ]}
          pickerKey="diet"
        />

        <SelectionOption
          label="Service Type"
          value={serviceType}
          selectedValue={serviceType}
          options={[
            { label: "Any", value: "Any" },
            { label: "Fast Food", value: "Fast Food" },
            { label: "Restaurant", value: "Restaurant" },
            { label: "Locally Owned", value: "Locally Owned" },
          ]}
          pickerKey="serviceType"
        />

        <SelectionOption
          label="Meal Type"
          value={mealType}
          selectedValue={mealType}
          options={[
            { label: "Any", value: "Any" },
            { label: "Breakfast", value: "Breakfast" },
            { label: "Lunch", value: "Lunch" },
            { label: "Dinner", value: "Dinner" },
            { label: "Snacks", value: "Snacks" },
          ]}
          pickerKey="mealType"
        />

        <SelectionOption
          label="Distance"
          value={distance}
          selectedValue={distance}
          options={[
            { label: "Any", value: "Any" },
            { label: "1 mile", value: "1 mile" },
            { label: "5 miles", value: "5 miles" },
            { label: "10 miles", value: "10 miles" },
          ]}
          pickerKey="distance"
        />

        <SelectionOption
          label="Rating"
          value={rating}
          selectedValue={rating}
          options={[
            { label: "Any", value: "Any" },
            { label: "3+ Stars", value: "3" },
            { label: "4+ Stars", value: "4" },
            { label: "5 Stars Only", value: "5" },
          ]}
          pickerKey="rating"
        />

        <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity key={option.value} onPress={() => handleSelection(option.value)}>
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectionContainer: {
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#ffaa00',
    borderRadius: 10,
    padding: 10,
  },
  selectionLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  textBoxText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#ffaa00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  optionText: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ffaa00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecommendScreen;