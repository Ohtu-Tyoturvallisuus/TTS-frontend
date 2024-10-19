import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ButtonGroup = ({ options = [], selectedValue, onChange }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          testID={`button-${option}`}
          onPress={() => onChange(option)}
          style={[
            styles.button,
            selectedValue === option && styles.selectedButton,
          ]}
        >
          <Text style={styles.buttonText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#6f7072',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
    minHeight: 48,
    minWidth: 48,
    paddingVertical: 10,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    letterSpacing: 1,
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: "#FF8C00",
  },
});

export default ButtonGroup;