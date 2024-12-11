import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MysteryPick = ({ navigation }) => {
  const [position, setPosition] = useState(new Animated.Value(0)); 
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          Alert.alert('Error', 'User not logged in');
          return;
        }

        const response = await axios.post('http://172.20.10.2:5001/nearby-restaurants', {
          userId,
          latitude: 37.7749, // Replace with actual latitude
          longitude: -122.4194, // Replace with actual longitude
        });

        const restaurants = response.data.map(restaurant => ({
          color: '#FFB84D', // You can set different colors if needed
          label: restaurant.name,
        }));

        setSegments(restaurants);
      } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        Alert.alert('Error', 'Unable to fetch nearby restaurants. Please try again.');
      }
    };

    fetchNearbyRestaurants();
  }, []);

  const handleSpin = () => {
    setButtonDisabled(true);

    const totalSegments = segments.length;
    const randomSegmentIndex = Math.floor(Math.random() * totalSegments);
    const segmentHeight = 150; 
    const totalSpinDistance = segmentHeight * totalSegments * 10; 

    const finalOffset = randomSegmentIndex * segmentHeight;
    Animated.timing(position, {
      toValue: -totalSpinDistance - finalOffset, 
      duration: 5000, 
      useNativeDriver: true,
    }).start(() => {
      
      setPosition(new Animated.Value(-finalOffset)); 
      setSelectedSegment(segments[randomSegmentIndex].label);
      setButtonDisabled(false); 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Can't Choose?</Text>

      <View style={styles.drumContainer}>
        <Animated.View style={[styles.drum, { transform: [{ translateY: position }] }]}>
          {Array(segments.length * 3) 
            .fill(segments)
            .flat()
            .map((segment, index) => (
              <View key={index} style={[styles.segment, { backgroundColor: segment.color }]}>
                <Text style={styles.segmentLabel}>{segment.label}</Text>
              </View>
            ))}
        </Animated.View>
      </View>
      
      <Image source={require('../../assets/images/knob.png')} style={styles.knob} />

      <TouchableOpacity
        style={[styles.spinButton, { backgroundColor: buttonDisabled ? '#ccc' : '#ffaa00' }]}
        onPress={handleSpin}
        disabled={buttonDisabled}
      >
        <Text style={styles.spinButtonText}>Spin Me!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginBottom: 30,
  },
  drumContainer: {
    width: 200,
    height: 460, 
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#ffaa00',
    borderRadius: 10,
  },
  drum: {
    position: 'absolute',
    width: '100%',
  },
  segment: {
    width: '100%',
    height: 150, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,     
    borderColor: '#ffffff', 
    borderRadius: 10,
  },
  segmentLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  spinButton: {
    marginTop: 50,
    padding: 15,
    borderRadius: 8,
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffaa00',
  },
  knob: {
    position: 'absolute',
    top: 320,
    right: 60, 
    transform: [{ translateY: -30 }, { rotate: '90deg' }], 
    width: 50,
    height: 50, 
  },
});

export default MysteryPick;