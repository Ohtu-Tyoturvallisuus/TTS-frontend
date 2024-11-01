import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ setFilter }) => {
  const { t } = useTranslation();

  return (
    <View className="flex items-center justify-center py-3">
      <TextInput
        style={styles.searchInput}
        placeholder={t('searchbar.placeholder')}
        placeholderTextColor="#A9A9A9"
        onChangeText={setFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: '100%',
  },
});

export default SearchBar;