import countriesData from '@lang/locales/languages.json';

// File for language related utility functions.

export const getLanguageToFlagMap = () => {
  return countriesData.countries.reduce((map, country) => {
    map[country.value] = country.flagCode;
    return map;
  }, {});
};