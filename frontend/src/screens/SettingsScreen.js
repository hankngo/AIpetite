import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'; 

const SettingsScreen = ({ navigation }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared. User logged out successfully.');
      setIsAuthenticated(false); 
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      });
    } catch (error) {
      console.error('Error during logout:', error);
      alert('There was an issue logging out. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
