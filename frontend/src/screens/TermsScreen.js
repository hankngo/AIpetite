import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const TermsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Term 1</Text>
      <Text style={styles.content}>
        If you can read this, then the Terms and Conditions link works.
      </Text>
      <Text style={styles.title}>Term 2</Text>
      <Text style={styles.content}>
        If you can read this, then the Terms and Conditions link works.
      </Text>
      <Text style={styles.title}>Term 3</Text>
      <Text style={styles.content}>
        If you can read this, then the Terms and Conditions link works.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: 'black',
  },
  content: {
    fontSize: 16,
    color: 'black',
  },
});

export default TermsScreen;
