import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import enFormFields from './locales/en/formFields.json';
import fiFormFields from './locales/fi/formFields.json';
import enTranslation from './locales/en/translation.json';
import fiTranslation from './locales/fi/translation.json';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: (callback) => {
      const locales = Localization.getLocales();
      if (locales && locales.length) {
        const bestLanguage = locales[0].languageTag;
        callback(bestLanguage);
      } else {
        callback('en-GB');
      }
    },
    init: () => {},
    cacheUserLanguage: () => {},
  };

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-GB',
    debug: true, // TODO: Set to false in production

    resources: {
      en: { formFields: enFormFields, translation: enTranslation },
      fi: { formFields: fiFormFields, translation: fiTranslation },
    },

    interpolation: {
      escapeValue: false,
    },

    ns: ['formFields', 'translation'],
    defaultNS: 'translation',
  });

export default i18n;
