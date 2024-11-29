import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';

const MysteryPick = ({ navigation }) => {
  const [position, setPosition] = useState(new Animated.Value(0)); 
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  const segments = [
    { color: '#FFB84D', label: 'McDonalds' }, 
    { color: '#FF8000', label: 'Taco Bell' },  
    { color: '#FF9933', label: 'La Vics' }, 
    { color: '#FFCC00', label: 'Chipotle' },   
    { color: '#FFD700', label: 'Panda Express' },
    { color: '#FFB300', label: 'In N Out' },   
  ];

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
