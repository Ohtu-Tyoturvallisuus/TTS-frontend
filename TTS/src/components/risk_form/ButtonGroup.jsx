import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ButtonGroup = ({ options = [], selectedValue, onChange }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          testID={`button-${option}`}
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

export default ButtonGroup;