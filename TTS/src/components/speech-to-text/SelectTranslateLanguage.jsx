import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import CountryFlag from '@components/CountryFlag';
import countriesData from '@lang/locales/languages.json';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useTranslationLanguages } from '@contexts/TranslationContext';

const SelectTranslateLanguage = ({ setTranslationLanguages }) => {
  const { t } = useTranslation();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const countries = countriesData.countries;
  const { fromLang } = useTranslationLanguages();
  const [fromCountry, setFromCountry] = useState(() => {
    const initialCountry = countries.find(country => country.value === fromLang);
    return initialCountry ? initialCountry : countries[0];
  });
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Update origin value if fromLang changes
  useEffect(() => {
    const newOriginCountry = countries.find(country => country.value === fromLang);
    if (newOriginCountry) {
      setFromCountry(newOriginCountry);
    } else if (countries.length > 0) {
      setFromCountry(countries[0]);
    }
  }, [fromLang, countries]);

// Filter countries based on the search text and exclude the origin country
const filteredCountries = countries.filter(country =>
  country.label_native.toLowerCase().includes(searchText.toLowerCase()) &&
  country.value !== fromCountry.value
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
          {selectedCountries.length === 0 ? (
            <Text>{t('selecttranslate.selectTranslationLanguages')}</Text>
          ) : (
            <Text>{t('selecttranslate.selectedTranslationLanguages')}</Text>
          )}
          <View style={styles.flagsContainer}>
            <CountryFlag isoCode={fromCountry.flagCode} size={24} style={styles.countryFlag} />
            <Icon name="arrow-right" size={20} color="black" className={'mr-4 ml-1'}/>
            {selectedCountries.length > 0 && (
              selectedCountries.map(country => (
               <View key={country} style={{marginRight: 5, marginBottom: 5}}>
                  <CountryFlag 
                    isoCode={countries.find(c => c.value === country).flagCode} 
                    size={24} 
                  />
                </View>
              ))
            )}
          </View>
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
                      <Icon name="check" size={20} color="green" style={styles.checkmark} testID='check-icon' />
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
                <View style={styles.originLanguageContainer}>
                  <View className="flex-col items-center ml-10">
                    <CountryFlag isoCode={fromCountry.flagCode} size={32} style={styles.countryFlag} />
                    <Text style={styles.countryName}>{fromCountry.label_native}</Text>
                  </View>
                  <Icon name="arrow-right" size={20} color="black" />
                </View>
                <View style={styles.selectedCountriesColumn}>
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
            </View>
          )}
          <View style={styles.button}>
            <TouchableOpacity style={styles.readyButton} onPress={() =>{
                setModalVisible(false);
                setTranslationLanguages(selectedCountries);
              }}>
              <Text style={styles.buttonText}>{t('general.done')}</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  countryFlag: {
    marginRight: 10,
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
    marginTop: 5,
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
  originLanguageContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  readyButton: {
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 5,
    justifyContent: 'center',
    marginVertical: 10,
    minHeight: 48,
    minWidth: 48,
    padding: 15,
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
  selectedCountriesColumn: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedCountry: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
});

export default SelectTranslateLanguage;
