import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CountryFlag from '@components/CountryFlag';
import countriesData from '@lang/locales/languages.json';

const LanguageSelector = ({ langOptions, onSelect}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(langOptions[0]);
  const countries = countriesData.countries;

  const handleSelect = (langCode) => {
    setSelectedLanguage(langCode);
    onSelect(langCode);
  };

  return (
    <View style={styles.container}>
      {langOptions.map(langCode => {
        const country = countries.find(c => c.value === langCode);
        if (!country) return null;

        return (
          <TouchableOpacity
            key={langCode}
            onPress={() => handleSelect(langCode)}
            style={[
              styles.flagContainer,
              selectedLanguage === langCode && styles.selectedFlag
            ]}
          >
            <CountryFlag
              isoCode={country.flagCode}
              size={32}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 5,
  },
  flagContainer: {
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFlag: {
    borderColor: '#ef7d00',
    backgroundColor: '#fff8f0',
  },
});

export default LanguageSelector;
