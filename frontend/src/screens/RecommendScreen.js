import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native';

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
      </ScrollView>

      {/* Modal for options */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelection(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeModalText}>Close</Text>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    maxHeight: '60%', 
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  closeModalButton: {
    backgroundColor: '#ffaa00',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default RecommendScreen;
