import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const SettingsScreen = ({ navigation, setIsAuthenticated }) => {
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.settingsOption}>
          <Text style={styles.optionText}>Preferences</Text>
        </View>
        <View style={styles.settingsOption}>
          <Text style={styles.optionText}>Privacy</Text>
        </View>
        <View style={styles.settingsOption}>
          <Text style={styles.optionText}>Notifications</Text>
        </View>
        <View style={styles.settingsOption}>
          <Text style={styles.optionText}>Help</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  settingsOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  logoutText: {
    fontSize: 18,
    color: 'red',
    textDecorationLine: 'underline',
  },
});

export default SettingsScreen;
