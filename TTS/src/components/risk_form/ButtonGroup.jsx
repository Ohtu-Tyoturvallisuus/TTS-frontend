import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ButtonGroup = ({ options = [], onChange }) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <View style={styles.buttonGroup}>
      {options.map((value) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.button,
            { backgroundColor: selectedValue === value ? 'blue' : 'gray' },
          ]}
          onPress={() => {
            const newValue = selectedValue === value ? '' : value;
            setSelectedValue(newValue);
            onChange(newValue);
          }}
        >
          <Text style={styles.buttonText}>{value}</Text>
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