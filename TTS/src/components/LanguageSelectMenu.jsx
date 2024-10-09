import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Button, ScrollView } from 'react-native';
import CountryFlag from 'react-native-country-flag';

const LanguageSelectMenu = ({
    setRecordingLanguage = null,
    setTranslationLanguages = null
  }) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false)

  const countries = setRecordingLanguage
    ? [
      { label: 'Suomi', value: 'fi-FI', flagCode: 'FI' },
      { label: 'Ruotsi', value: 'sv-SE', flagCode: 'SE' },
      { label: 'Englanti', value: 'en-US', flagCode: 'GB' },
      { label: 'Viro', value: 'et-EE', flagCode: 'EE' },
      { label: 'Latvia', value: 'lv-LV', flagCode: 'LV' },
      { label: 'Liettua', value: 'lt-LT', flagCode: 'LT' },
    ]
    : [
      { label: 'Suomi', value: 'fi', flagCode: 'FI' },
      { label: 'Ruotsi', value: 'sv', flagCode: 'SE' },
      { label: 'Englanti', value: 'en', flagCode: 'GB' },
      { label: 'Viro', value: 'et', flagCode: 'EE' },
      { label: 'Latvia', value: 'lv', flagCode: 'LV' },
      { label: 'Liettua', value: 'lt', flagCode: 'LT' },
    ]

  // Filter countries based on the search text
  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleCountry = (value) => {
    setSelectedCountries((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((country) => country !== value);
      } else {
        if (setRecordingLanguage) {
          return [value];
        } else {
          return [...prevSelected, value];
        }
      }
    });
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.countryItem}
        onPress={() => setModalVisible(true)}
      >
        {setRecordingLanguage ? (
              <Text>Valitse tunnistettava kieli</Text>
          ) : (
            <Text>Valitse kielet, joille haluat kääntää</Text>
          )
        }
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType='slide'>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            {setRecordingLanguage ? (
                <Text style={styles.label}>Valitse kieli:</Text>
              ) : (
                <Text style={styles.label}>Valitse kielet:</Text>
              )
            }
            <TextInput
              style={styles.searchInput}
              placeholder="Hae kieliä..."
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
                <Text style={styles.countryLabel}>{country.label}</Text>
                {selectedCountries.includes(country.value) && (
                  <Text style={styles.selectedText}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            {selectedCountries.length > 0 && (
              <View style={styles.selectedCountriesContainer}>
                {setRecordingLanguage ? (
                    <Text style={styles.selectedCountriesLabel}>Valittu kieli:</Text>
                  ) : (
                    <Text style={styles.selectedCountriesLabel}>Valitut kielet:</Text>
                  )
                }
                {selectedCountries.map((value) => {
                  const countryData = countries.find((country) => country.value === value);
                  return (
                    <View key={value} style={styles.selectedCountry}>
                      <CountryFlag isoCode={countryData.flagCode} size={32} />
                      <Text style={styles.countryName}>{countryData.label}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          <View style={styles.button}>
            <Button
              title='Sulje'
              onPress={() => {
                setModalVisible(false)
                setRecordingLanguage
                  ? selectedCountries.length > 0
                    ? setRecordingLanguage(selectedCountries[0])
                    : setRecordingLanguage('')
                  : setTranslationLanguages(selectedCountries)
              }}
            />
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginVertical: 5,
    width: '100%',
  },
  countryLabel: {
    marginLeft: 10,
    flex: 1,
  },
  selectedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  selectedCountriesContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 10,
    width: '100%',
  },
  selectedCountriesLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedCountry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  countryName: {
    marginLeft: 10,
    fontSize: 18,
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#e1e4e8',
  },
});

export default LanguageSelectMenu;