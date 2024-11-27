import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TranslationsView from '@components/speech-to-text/TranslationsView';

jest.mock('react-native-country-flag', () => {
  const { Text } = require('react-native');
  const MockedCountryFlag = () => <Text>MockedCountryFlag</Text>;
  return MockedCountryFlag;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

describe('TranslationsView Component', () => {
  const translations = {
    en: 'Hello',
    fr: 'Bonjour',
  };

  const languageToFlagMap = {
    en: 'GB',
    fr: 'FR',
  };

  const mockT = (key, options) => {
      const translations = {
        'speechtotext.maxLength': 'Max Length',
        'speechtotext.seconds': '{{count}} seconds',
      };

      let translation = translations[key] || key;

      if (options && options.count !== undefined) {
        translation = translation.replace('{{count}}', options.count);
      }

      return translation;
    };

  it('renders translations with correct flags', () => {
    const { getByText, getAllByText } = render(
      <TranslationsView
        translations={translations}
        languageToFlagMap={languageToFlagMap}
        t={mockT}
        timeout={30000}
      />
    );

    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('Bonjour')).toBeTruthy();
    const flags = getAllByText('MockedCountryFlag');
    expect(flags.length).toBe(2);
  });

  it('renders flags for languages not in the flag map', () => {
    const { getByText } = render(
      <TranslationsView
        translations={{ es: 'Hola' }}
        languageToFlagMap={languageToFlagMap}
        t={mockT}
        timeout={20000}
      />
    );

    expect(getByText('Hola')).toBeTruthy();
    expect(getByText('MockedCountryFlag')).toBeTruthy();
  });

  it('toggles translations visibility when button is pressed', () => {
    const { getByText, queryByText } = render(
      <TranslationsView
        translations={{ en: 'Hello' }}
        hide={false}
      />
    );

    // Initially visible
    expect(getByText('Hello')).toBeTruthy();

    // Click toggle button
    const toggleButton = getByText('translationsview.hide');
    fireEvent.press(toggleButton);

    // Should be hidden
    expect(queryByText('Hello')).toBeNull();

    // Click toggle button again
    fireEvent.press(toggleButton);

    // Should be visible again
    expect(getByText('Hello')).toBeTruthy();
  });

  it('respects initial hide prop', () => {
    const { queryByText } = render(
      <TranslationsView
        translations={{ en: 'Hello' }}
        hide={true}
      />
    );

    // Should be initially hidden
    expect(queryByText('Hello')).toBeNull();
  });
});
