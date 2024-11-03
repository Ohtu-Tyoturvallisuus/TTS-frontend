import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountryFlag from 'react-native-country-flag';

const TranslationsView = ({ translations, languageToFlagMap, t, timeout }) => (
  <View>
    {Object.entries(translations).map(([lang, text]) => {
      const flagCode = languageToFlagMap[lang] || lang.toUpperCase();
      return (
        <View style={styles.textContainer} key={lang}>
          <CountryFlag isoCode={flagCode} size={24} />
          <Text style={styles.translatedText}>{text}</Text>
        </View>
      );
    })}
    <Text>({t('speechtotext.maxLength')}: {t('speechtotext.seconds', { count: timeout / 1000 })}.)</Text>
  </View>
);

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderColor: 'light#c5c6c8',
    borderWidth: 1,
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginVertical: 3,
    maxWidth: '90%',
    padding: 15,
  },
  translatedText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default TranslationsView;