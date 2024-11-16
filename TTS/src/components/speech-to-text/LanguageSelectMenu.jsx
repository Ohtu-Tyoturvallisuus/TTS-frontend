import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import CountryFlag from '@components/CountryFlag';
import countriesData from '@lang/locales/languages.json';
import { useTranslation } from 'react-i18next';

import CloseButton from '@components/buttons/CloseButton';

const LanguageSelectMenu = ({
    setRecordingLanguage = null,
    setTranslationLanguages = null
  }) => {
  const { t } = useTranslation();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const countries = setRecordingLanguage
    ? countriesData.countries.map(country => ({ ...country, value: `${country.value}-${country.flagCode}` }))  // Adjust value for recording
    : countriesData.countries;

  // Filter countries based on the search text
  const filteredCountries = countries.filter(country =>
    country.label_native.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCountry = (value) => {
    setSelectedCountries((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((country) => country !== value);
      } else {
        if (setRecordingLanguage) {
          return [value]; // Only allow one recording language to be selected
        } else {
          return [...prevSelected, value]; // Allow multiple translation languages
        }
      }
    });
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.selectCountryButton}
        onPress={() => setModalVisible(true)}
      >
        {setRecordingLanguage ? (
          <View style={styles.buttonContent}>
            <Text>{t('languageselectmenu.selectRecordingLanguage')}</Text>
            {selectedCountries.length > 0 && (
              <View style={{flexDirection: 'row'}}>
                {selectedCountries.map(country => (
                  <CountryFlag 
                    key={country}
                    isoCode={countries.find(c => c.value === country).flagCode} 
                    size={24} 
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Text>{t('languageselectmenu.selectTranslationLanguages')}</Text>
            {selectedCountries.length > 0 && (
              <View style={{flexDirection: 'row'}}>
                {selectedCountries.map(country => (
                 <View key={country} style={{marginRight: 5}}>
                    <CountryFlag 
                      isoCode={countries.find(c => c.value === country).flagCode} 
                      size={24} 
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType='slide'>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            {setRecordingLanguage ? (
                <Text style={styles.label}>{t('languageselectmenu.selectLanguage')}:</Text>
              ) : (
                <Text style={styles.label}>{t('languageselectmenu.selectLanguages')}:</Text>
              )
            }
            <TextInput
              style={styles.searchInput}
              placeholder={t('languageselectmenu.searchLanguages')}
              value={searchText}
              onChangeText={setSearchText}
            />
            {filteredCountries.map((country) => (
              <TouchableOpacity
                key={country.value}
                style={styles.countryItem}
                onPress={() => toggleCountry(country.value)}
              >
                <CountryFlag isoCode={country.flagCode} size={24} />
                <Text style={styles.countryLabel}>{country.label_native}</Text>
                {selectedCountries.includes(country.value) && (
                  <Text style={styles.selectedText}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            {selectedCountries.length > 0 && (
              <View style={styles.selectedCountriesContainer}>
                {setRecordingLanguage ? (
                    <Text style={styles.selectedCountriesLabel}>{t('languageselectmenu.selectedLanguage')}:</Text>
                  ) : (
                    <Text style={styles.selectedCountriesLabel}>{t('languageselectmenu.selectedLanguages')}:</Text>
                  )
                }
                {selectedCountries.map((value) => {
                  const countryData = countries.find((country) => country.value === value);
                  return (
                    <View key={value} style={styles.selectedCountry}>
                      <CountryFlag isoCode={countryData.flagCode} size={32} />
                      <Text style={styles.countryName}>{countryData.label_native}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          <View style={styles.button}>
            <CloseButton
              onPress={() => {
                setModalVisible(false);
                setRecordingLanguage
                  ? selectedCountries.length > 0
                    ? setRecordingLanguage(selectedCountries[0])
                    : setRecordingLanguage('')
                  : setTranslationLanguages(selectedCountries);
              }}
            />
          </View>
        </ScrollView>
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
    justifyContent: 'center',
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
  countryLabel: {
    flex: 1,
    marginLeft: 10,
  },
  countryName: {
    fontSize: 18,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
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
    width: 280,
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
  selectedCountry: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  selectedText: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default LanguageSelectMenu;
