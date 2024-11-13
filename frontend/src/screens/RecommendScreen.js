import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const RecommendScreen = ({ navigation }) => {
  const [diet, setDiet] = useState('None');
  const [serviceType, setServiceType] = useState('Any');
  const [mealType, setMealType] = useState('Any');
  const [distance, setDistance] = useState('Any');
  const [rating, setRating] = useState('Any');
  
  const [isPickerVisible, setIsPickerVisible] = useState({
    allergy: false,
    diet: false,
    serviceType: false,
    mealType: false,
    healthyOption: false,
    distance: false,
    rating: false,
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  const togglePickerVisibility = (picker) => {
    setIsPickerVisible((prev) => ({ ...prev, [picker]: !prev[picker] }));
  };

  const PickerOption = ({ label, value, selectedValue, onChange, pickerKey }) => (
    <View style={styles.selectionContainer}>
      <Text style={styles.selectionLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.textBox}
        onPress={() => togglePickerVisibility(pickerKey)}
      >
        <Text style={styles.textBoxText}>{selectedValue}</Text>
      </TouchableOpacity>
      <Modal
        visible={isPickerVisible[pickerKey]}
        transparent={true}
        animationType="slide"
        onRequestClose={() => togglePickerVisibility(pickerKey)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => {
                onChange(itemValue);
                togglePickerVisibility(pickerKey);
              }}
            >
              {value.map((option) => (
                <Picker.Item label={option.label} value={option.value} key={option.value} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
  const showRecommendations = () => {
    setIsModalVisible(true);
  };

  // Recommendations data (for now it's a mock data array)
  const recommendations = [
    { name: "Healthy Eatery", type: "Restaurant", distance: "3 miles", rating: "4+ Stars" },
    { name: "Vegan Bistro", type: "Restaurant", distance: "2 miles", rating: "5 Stars" },
    { name: "Fast Bites", type: "Fast Food", distance: "5 miles", rating: "3+ Stars" },
    { name: "Local Diner", type: "Locally Owned", distance: "1 mile", rating: "4+ Stars" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Let's Set Your Preferences First:</Text>

        

        <PickerOption
          label="Dietary Preference"
          value={[
            { label: "None", value: "None" },
            { label: "Vegan", value: "Vegan" },
            { label: "Vegetarian", value: "Vegetarian" },
            { label: "Pescatarian", value: "Pescatarian" },
            { label: "Keto", value: "Keto" },
          ]}
          selectedValue={diet}
          onChange={setDiet}
          pickerKey="diet"
        />

        <PickerOption
          label="Service Type"
          value={[
            { label: "Any", value: "Any" },
            { label: "Fast Food", value: "Fast Food" },
            { label: "Restaurant", value: "Restaurant" },
            { label: "Locally Owned", value: "Locally Owned" },
          ]}
          selectedValue={serviceType}
          onChange={setServiceType}
          pickerKey="serviceType"
        />

        <PickerOption
          label="Meal Type"
          value={[
            { label: "Any", value: "Any" },
            { label: "Breakfast", value: "Breakfast" },
            { label: "Lunch", value: "Lunch" },
            { label: "Dinner", value: "Dinner" },
            { label: "Snacks", value: "Snacks" },
          ]}
          selectedValue={mealType}
          onChange={setMealType}
          pickerKey="mealType"
        />

        <PickerOption
          label="Distance"
          value={[
            { label: "Any", value: "Any" },
            { label: "1 mile", value: "1 mile" },
            { label: "5 miles", value: "5 miles" },
            { label: "10 miles", value: "10 miles" },
          ]}
          selectedValue={distance}
          onChange={setDistance}
          pickerKey="distance"
        />

        <PickerOption
          label="Rating"
          value={[
            { label: "Any", value: "Any" },
            { label: "3+ Stars", value: "3" },
            { label: "4+ Stars", value: "4" },
            { label: "5 Stars Only", value: "5" },
          ]}
          selectedValue={rating}
          onChange={setRating}
          pickerKey="rating"
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.recommendButton}
          onPress={showRecommendations} 
        >
          <Text style={styles.recommendButtonText}>Set Preferences</Text>
        </TouchableOpacity>
      </View>

      {/* Recommendations Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationHeader}>We Think You Will Like:</Text>
            <ScrollView style={styles.recommendationList}>
              {recommendations.map((item, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>{item.name}</Text>
                  <Text style={styles.recommendationDetails}>{item.type} - {item.distance} - {item.rating}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.recommendationCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.recommendationCloseText}>Close</Text>
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
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
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
  recommendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  recommendButton: {
    backgroundColor: '#ffaa00',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recommendationContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
  },
  recommendationHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recommendationList: {
    maxHeight: 300,
  },
  recommendationItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: '#333',
  },
  recommendationDetails: {
    fontSize: 14,
    color: '#888',
  },
  recommendationCloseButton: {
    marginTop: 20,
    backgroundColor: '#ffaa00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  recommendationCloseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecommendScreen;
