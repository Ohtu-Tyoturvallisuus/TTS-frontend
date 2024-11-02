import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ChangeLanguage } from '@components/settings/ChangeLanguage';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('ChangeLanguage Component', () => {
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with the current language if defined', () => {
    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'changelanguage.changeLanguage': 'Change Language',
          'changelanguage.languages.english': 'English',
          'changelanguage.languages.finnish': 'Suomi',
        };
        return translations[key] || key;
      },
      i18n: {
        language: 'fi-FI',
        changeLanguage: mockChangeLanguage,
      },
    });

    const { getByText } = render(<ChangeLanguage />);

    expect(getByText('Suomi')).toBeTruthy(); 
    expect(getByText('✔️')).toBeTruthy();
  });

  it('initializes with "en" when current language is undefined', () => {
    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'changelanguage.changeLanguage': 'Change Language',
          'changelanguage.languages.english': 'English',
          'changelanguage.languages.finnish': 'Suomi',
        };
        return translations[key] || key;
      },
      i18n: {
        language: '',
        changeLanguage: mockChangeLanguage,
      },
    });

    const { getByText } = render(<ChangeLanguage />);

    expect(getByText('English')).toBeTruthy(); 
    expect(getByText('✔️')).toBeTruthy();
  });

  it('changes language when a language option is pressed', async () => {
    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'changelanguage.changeLanguage': 'Change Language',
          'changelanguage.languages.english': 'English',
          'changelanguage.languages.finnish': 'Suomi',
        };
        return translations[key] || key;
      },
      i18n: {
        language: 'en-GB',
        changeLanguage: mockChangeLanguage,
      },
    });

    const { getByText } = render(<ChangeLanguage />);

    fireEvent.press(getByText('Suomi'));

    await waitFor(() => {
      expect(mockChangeLanguage).toHaveBeenCalledWith('fi-FI');
    });
  });
});
