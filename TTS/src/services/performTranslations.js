import { translateText } from '@services/apiService';

export const performTranslations = async (text, fromLang, toLangs) => {
  if (toLangs.length === 0) {
    return {
      translations: null,
      error: 'Please select at least one translating language',
    };
  }

  let state = {
    translations: null,
    error: null,
  };

  try {
    console.log(`Translating text from ${fromLang} to ${toLangs}`);
    const result = await translateText(text, fromLang, toLangs);
    state.translations = result;
  } catch (error) {
    state.error = 'Error translating text';
  }

  return state;
};
