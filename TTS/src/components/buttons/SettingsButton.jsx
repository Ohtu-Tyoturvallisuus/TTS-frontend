import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SettingsButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
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
    minHeight: 48,
    minWidth: 48,
    padding: 15,
    width: '75%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsButton;