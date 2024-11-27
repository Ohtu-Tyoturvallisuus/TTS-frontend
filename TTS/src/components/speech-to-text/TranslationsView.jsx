import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CountryFlag from '@components/CountryFlag';
import { getLanguageToFlagMap } from '@utils/languageUtils';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TranslationsView = ({ translations, hide = false }) => {
  const [showTranslations, setShowTranslations] = useState(!hide);
  const languageToFlagMap = getLanguageToFlagMap();
  const { t } = useTranslation(['translation', 'formFields']);

  const toggleTranslations = () => {
    setShowTranslations(!showTranslations);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      {Object.keys(translations).length > 0 && (
        <TouchableOpacity onPress={toggleTranslations} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {showTranslations ? t('translationsview.hide') : t('translationsview.show')}
          </Text>
          <Icon
            name={showTranslations ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      )}
      {showTranslations && Object.entries(translations).map(([lang, text]) => {
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
  toggleButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#c5c6c8',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
  },
  toggleButtonText: {
    color: '#000',
    marginRight: 5,
  },
  translatedText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default TranslationsView;
