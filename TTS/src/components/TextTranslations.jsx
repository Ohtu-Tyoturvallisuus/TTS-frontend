import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { translateText } from '@services/apiService';
import { useTranslation } from 'react-i18next';
import RecordingLanguageView from '@components/speech-to-text/RecordingLanguageView';
import SelectTranslateLanguage from '@components/speech-to-text/SelectTranslateLanguage';
import TranslationsView from './speech-to-text/TranslationsView';

const TextTranslations = ({ input = ''}) => {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState(input);
  const [translations, setTranslations] = useState({
    "sv": "Hej alla rackinstallatörer",
    "en": "Hello all rack installers",
    "fi": "Hei kaikki telineen asentajat tämä on pitkä viesti joka vie monta riviä ja tahdon että luette jokaisen rivin ajatuksella ilman että räpäytetätte edes silmiä. tässä on kiinni teidän koko elämä",
    "et": "Tere kõigile riiulite paigaldajatele",
    "lv": "Sveiki visiem plauktu uzstādītājiem",
  });
  const [error, setError] = useState(null);
  const [ fromLang, setFromLang ] = useState(i18n.language);

  React.useEffect(() => {
    const handleLanguageChange = () => {
      setFromLang(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const [ toLangs, setToLangs ] = useState([]);
  const fromLangFlagCode = fromLang.slice(-2);
  
  const handleTranslateText = async () => {
    if (toLangs.length === 0) {
      setError('Please select at least one translating language');
      return;
    }

    try {
      const result = await translateText(text, from=fromLang, to=toLangs);
      const transformedTranslations = result[0].translations.reduce((acc, { text, to }) => {
        acc[to] = text;
        return acc;
      }, {});
      console.log('transformedTranslations:', transformedTranslations);
      setTranslations(transformedTranslations);
      setError(null);
    } catch (error) {
      setError('Error translating text');
    }
  };
  console.log( JSON.stringify(translations, null, 2));
  return (
    <View style={{ padding: 10 }}>
      <TextInput
        className="border border-gray-300 rounded p-2 h-24"
        placeholder="Enter text to translate"
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />
      <RecordingLanguageView recordingLanguageFlagCode={fromLangFlagCode} t={t} />
      <SelectTranslateLanguage setTranslationLanguages={setToLangs} />
      <Button title="Translate" onPress={handleTranslateText} />
      {translations && (
          <TranslationsView translations={translations} t={t}/>
      )}
      {error && (
        <Text style={{ color: 'red' }}>{error}</Text>
      )}
      
    </View>
  );
};

export default TextTranslations;