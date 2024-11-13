import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';

const MysteryPick = ({ navigation }) => {

  const [rotation, setRotation] = useState(new Animated.Value(0));
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSpin = () => {
    setButtonDisabled(true);

    const minRotations = 5 * 360; // 5 full rotations (5 * 360 degrees)
    const additionalRotation = Math.floor(Math.random() * 360); // Random additional rotation (0 - 360 degrees)

    const totalRotation = minRotations + additionalRotation;

    Animated.timing(rotation, {
      toValue: totalRotation + 3600, // Ensure a minimum of 5 rotations + the random extra rotations
      duration: 3000, // 3 seconds for the animation
      useNativeDriver: true,
    }).start();
  };

  const wheelRotation = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>We'll Pick For You!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.wheelContainer}>
          <Animated.Image
            source={require('../../assets/images/wheel.png')}
            style={[styles.wheel, { transform: [{ rotate: wheelRotation }] }]}
          />
          <Image source={require('../../assets/images/knob.png')} style={styles.knob} />
        </View>

        {/* Spin Button */}
        <TouchableOpacity
          style={[styles.spinButton, { backgroundColor: buttonDisabled ? '#ccc' : '#ffaa00' }]}  // Change button color when disabled
          onPress={handleSpin}
          disabled={buttonDisabled}  // Disable the button if it's been pressed
        >
          <Text style={styles.spinButtonText}>Spin the Wheel</Text>
        </TouchableOpacity>
        
        <Text style={styles.subtleText}>Your Recommended Places:</Text>

        {/* Key legend for each color section */}
        <View style={styles.keyContainer}>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: '#FF0000' }]} />
            <Text style={styles.keyLabel}>McDonalds</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: '#FF00FF' }]} />
            <Text style={styles.keyLabel}>Taco Bell</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: '#0000FF' }]} />
            <Text style={styles.keyLabel}>La Vics</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: '#00FFFF' }]} />
            <Text style={styles.keyLabel}>Chipotle</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: '#00FF00' }]} />
            <Text style={styles.keyLabel}>Panda Express</Text>
          </View>
          <View style={styles.keyItem}>
            <View style={[styles.colorBox, { backgroundColor: '#FFFF00' }]} />
            <Text style={styles.keyLabel}>In N Out</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    marginTop: 10,
    marginLeft: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffaa00',
  },
  scrollContent: {
    flexGrow: 1, // Ensures the content inside ScrollView is vertically scrollable
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    position: 'relative',
  },
  wheel: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  knob: {
    position: 'absolute',
    top: -35,  // Adjust this value to position the knob above the wheel
    left: 150,
    width: 40,
    height: 40,
    marginLeft: -20,  // Centers the knob horizontally (half the width of the knob)
  },
  spinButton: {
    marginTop: 50,
    padding: 10,
    borderRadius: 8,
  },
  spinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffaa00',
    textAlign: 'center',
    marginTop: 25,
  },
  keyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  keyItem: {
    flexDirection: 'column',  // Stack the items vertically
    alignItems: 'center',
    margin: 10,
    width: '40%',  // Limit the width to 40% for each color box (so they can fit two per row)
  },
  colorBox: {
    width: 60,
    height: 30,
    marginBottom: 5,
    borderRadius: 5,
  },
  keyLabel: {
    fontSize: 14,
    color: '#333',
  },
});

export default MysteryPick;
