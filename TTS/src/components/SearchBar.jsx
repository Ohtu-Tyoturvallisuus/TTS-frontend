import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ setFilter }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Etsi hakusanalla..."
        placeholderTextColor="#A9A9A9"
        onChangeText={setFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    width: 350,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#000000',
    fontSize: 18,
    color: '#151E26',
    textAlign: 'center',
  },
});

export default SearchBar;