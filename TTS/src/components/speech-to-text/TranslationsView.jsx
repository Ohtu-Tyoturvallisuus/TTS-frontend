import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountryFlag from '@components/CountryFlag';
import { getLanguageToFlagMap } from '@utils/languageUtils';

const TranslationsView = ({ translations }) => {
  const languageToFlagMap = getLanguageToFlagMap();

  return (
    <View style={{ alignItems: 'center' }}>
      {Object.entries(translations).map(([lang, text]) => {
        const flagCode = languageToFlagMap[lang] || lang.toUpperCase();
        return (
          <View style={styles.textContainer} key={lang}>
            <CountryFlag isoCode={flagCode} size={24} style={styles.countryFlag} />
            <Text style={styles.translatedText}>{text}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  countryFlag: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  textContainer: {
    backgroundColor: '#f0f0f0',
    borderColor: '#c5c6c8',
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 3,
    padding: 15,
    paddingLeft: 40,
    position: 'relative',
    width: '90%',
  },
  translatedText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default TranslationsView;
