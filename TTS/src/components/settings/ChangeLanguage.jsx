import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

// Define your supported languages
const langs = ['en', 'fi'];

export const ChangeLanguage = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');

  // Change the i18n language when the language state is changed
  const handleLanguageChange = (currentLang) => {
    setLang(currentLang);
    i18n.changeLanguage(currentLang); // Change the language globally in the app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.language}>
        {t('changelanguage.changeLanguage')}
      </Text>

      {langs.map((currentLang, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.listItem,
            currentLang === lang && styles.selectedItem,
          ]}
          onPress={() => handleLanguageChange(currentLang)}
        >
          <Text style={styles.listItemText}>
            {currentLang === 'en' ? t('changelanguage.languages.english') : t('changelanguage.languages.finnish')}
          </Text>
          {currentLang === lang && <Text style={styles.checkmark}>✔️</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  checkmark: {
    color: 'green',
    fontSize: 18,
  },
  container: {
    padding: 20,
  },
  language: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 15,
  },
  listItemText: {
    fontSize: 18,
  },
  selectedItem: {
    backgroundColor: '#ddd',
  },
});

export default ChangeLanguage;
