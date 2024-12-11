import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TranslationItem from './TranslationItem';

const TranslationsView = ({ translations, hide = false }) => {
  const [showTranslations, setShowTranslations] = useState(!hide);
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
      {showTranslations && Object.entries(translations).map(([lang, text]) => (
        <TranslationItem
          key={lang}
          langCode={lang}
          text={text}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TranslationsView;
