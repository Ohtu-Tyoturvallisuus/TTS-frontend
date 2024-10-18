import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CloseButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Sulje</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#6f7072',
    borderRadius: 5,
    justifyContent: 'center',
    marginVertical: 10,
    padding: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CloseButton;