import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ButtonGroup = ({ options, selectedValue, onChange }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onChange(option)}
          style={{
            padding: 10,
            backgroundColor: selectedValue === option ? 'blue' : 'gray',
            margin: 5,
          }}
        >
          <Text style={{ color: 'white' }}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ButtonGroup;