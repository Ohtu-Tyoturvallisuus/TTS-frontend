import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [fromLang, setFromLang] = useState(i18n.language.substring(0, 2));
  const [toLangs, setToLangs] = useState([]);

  useEffect(() => {
    console.log(`TranslationContext language set to ${i18n.language.substring(0, 2)}`);
    setFromLang(i18n.language.substring(0, 2));
  }, [i18n.language]);

  return (
    <TranslationContext.Provider value={{ fromLang, setFromLang, toLangs, setToLangs }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationLanguages = () => useContext(TranslationContext);
