import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const AccountHeader = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain" 
      />
      <TouchableOpacity 
        onPress={() => navigation.navigate('Settings')} 
        style={styles.settingsButton}
      >
        <Image 
          source={require('../../assets/images/settings_icon.png')} 
          style={styles.settingsIcon} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 45,
    height: 60, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 225, 
    height: 225,
    marginLeft: 70,
  },
  settingsButton: {
    marginLeft: 60,
  },
  settingsIcon: {
    width: 24, 
    height: 24, 
    tintColor: '#ffaa00', 
  },
});

export default AccountHeader;
