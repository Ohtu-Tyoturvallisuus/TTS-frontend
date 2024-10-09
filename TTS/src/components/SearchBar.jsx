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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    color: '#151E26',
    fontSize: 18,
    height: 50,
    paddingHorizontal: 12,
    textAlign: 'center',
    width: 350,
  },
});

export default SearchBar;