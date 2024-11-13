import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import CountryFlag from '@components/CountryFlag';
import countriesData from '@lang/locales/languages.json';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome'; 

import CloseButton from '@components/buttons/CloseButton';

const SelectTranslateLanguage = ({ setTranslationLanguages }) => {
  const { t } = useTranslation();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const countries = countriesData.countries;

  // Filter countries based on the search text
  const filteredCountries = countries.filter(country =>
    country.label_native.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCountry = (value) => {
    setSelectedCountries((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((country) => country !== value);
      } else {
          return [...prevSelected, value]; // Allow multiple translation languages
        }
    });
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.selectCountryButton}
        onPress={() => setModalVisible(true)}
      >
        <View>
          <Text>{t('selecttranslate.selectTranslationLanguages')}</Text>
          {selectedCountries.length > 0 && (
            <View style={styles.flagsContainer}>
              {selectedCountries.map(country => (
               <View key={country} style={{marginRight: 5, marginBottom: 5}}>
                  <CountryFlag 
                    isoCode={countries.find(c => c.value === country).flagCode} 
                    size={24} 
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType='slide'>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Text style={styles.label}>{t('selecttranslate.selectLanguages')}:</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={t('selecttranslate.searchLanguages')}
              value={searchText}
              onChangeText={setSearchText}
            />
            
            <View style={styles.languagesContainer}>
              {filteredCountries.map((country) => (
                <View key={country.value} style={styles.countryItemContainer}>
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => toggleCountry(country.value)}
                  >
                    <CountryFlag isoCode={country.flagCode} size={32} style={styles.countryFlag} />
                    <Text style={styles.countryLabel}>{country.label_native}</Text>
                    {selectedCountries.includes(country.value) && (
                      <Icon name="check" size={20} color="green" style={styles.checkmark} />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          </ScrollView>
          {selectedCountries.length > 0 && (
          <View style={styles.selectedCountriesContainer}>
            <Text style={styles.selectedCountriesLabel}>{t('selecttranslate.selectedLanguages')}:</Text>
            <View style={styles.selectedCountriesRow}>
              {selectedCountries.map((value) => {
                const countryData = countries.find((country) => country.value === value);
                return (
                  <View key={value} style={styles.selectedCountry}>
                    <CountryFlag isoCode={countryData.flagCode} size={32} style={styles.countryFlag} />
                    <Text style={styles.countryName}>{countryData.label_native}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
          <View style={styles.button}>
            <CloseButton
              onPress={() => {
                setModalVisible(false);
                setTranslationLanguages(selectedCountries);
              }}
            />
          </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    padding: 20,
    width: '100%',
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  countryItem: {
    alignItems: 'center',
    borderColor: '#c5c6c8',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    marginVertical: 5,
    padding: 10,
    width: '100%',
  },
  countryItemContainer: {
    width: '48%',
  },
  countryLabel: {
    flex: 1,
    marginLeft: 10,
  },
  countryName: {
    fontSize: 18,
    marginLeft: 10,
  },
  flagsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    backgroundColor: 'white',
    flexGrow: 1,
  },
  searchInput: {
    borderColor: '#c5c6c8',
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  selectCountryButton: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderColor: '#c5c6c8',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    marginVertical: 5,
    padding: 10,
    width: '95%',
  },
  selectedCountriesContainer: {
    borderColor: '#c5c6c8',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    width: '100%',
  },
  selectedCountriesLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedCountriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedCountry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '50%',
  },
  selectedText: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default SelectTranslateLanguage;
