import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error storing data:', error);
    }
};

  const handleLogin = async () => {
    try {
      const userData = { email, password };
      const result = await axios.post("http://192.168.1.67:5001/login", userData);
      console.log(result.data);
  
      // Store user_id, email, and token in AsyncStorage
      await storeData('user_id', result.data.user_id); // Store user_id
      await storeData('email', result.data.email);
      await storeData('name', result.data.name);
      await storeData('token', result.data.token);
  
      console.log("Stored user_id: ", result.data.user_id);
      console.log("Stored name: ", result.data.name);
      console.log("Login successful. Navigating to Home...");
  
      // Navigate to the Tabs screen
      navigation.navigate('Tabs', { screen: 'HomeTab', params: { email } });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Login Error: ", error.response.data);
        console.error("Status Code: ", error.response.status);
        console.error("Headers: ", error.response.headers);
        Alert.alert('Login failed', `Error: ${error.response.data.message || 'An error occurred'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Login Error: No response received", error.request);
        Alert.alert('Login failed', 'No response received from the server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Login Error: ", error.message);
        Alert.alert('Login failed', `Error: ${error.message}`);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Ready To Grub?</Text>
            <Text style={styles.subtitle}>Sign Into Your Account</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <View style={styles.signUpContainer}>
              <Text style={styles.defaultText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signUpText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 400,
    height: 100,
    marginBottom: 80,
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#999',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffaa00',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  defaultText: {
    fontSize: 16,
    color: 'black',
  },
  signUpText: {
    fontSize: 16,
    color: '#ffaa00',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
