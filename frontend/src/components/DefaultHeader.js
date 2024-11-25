import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require('../../assets/images/logo.png')} // Update the path according to your structure
        style={styles.logo}
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 45,
    height: 60,
    marginRight: 14, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },

  logo: {
    width: 225, 
    height: 225, 
  },
});

export default CustomHeader;
