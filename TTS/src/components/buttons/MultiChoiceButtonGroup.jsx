import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MultiChoiceButtonGroup = ({ options = [], selectedValues = [], onChange, renderOption }) => {
  const isSelected = (option) => selectedValues.includes(option);

  const toggleSelection = (option) => {
    if (isSelected(option)) {
      onChange(selectedValues.filter((value) => value !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          testID={`button-${option}`}
          onPress={() => toggleSelection(option)}
          style={[
            styles.button,
            isSelected(option) && styles.selectedButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {renderOption ? renderOption(option) : option}
          </Text>
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

export default MultiChoiceButtonGroup;