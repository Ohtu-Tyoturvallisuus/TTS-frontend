import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ value, onChange, area }) => {
  const { t } = useTranslation();

  const getPlaceholderText = () => {
    if (area && area.length) {
      return `${t('searchbar.placeholder')} (${area})`;
    }
    return `${t('searchbar.placeholder')} (kaikki alueet)`;
  };

  return (
    <View className="flex items-center justify-center pt-3">
      <TextInput
        style={styles.searchInput}
        placeholder={getPlaceholderText()}
        placeholderTextColor="#A9A9A9"
        value={value}
        onChangeText={onChange}
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
