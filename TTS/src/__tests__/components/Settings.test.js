import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Settings } from '@components/Settings';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('Settings Component', () => {
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with the current language if defined', () => {
    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'settings.changeLanguage': 'Change Language',
          'settings.languages.english': 'English',
          'settings.languages.finnish': 'Finnish',
        };
        return translations[key] || key;
      },
      i18n: {
        language: 'fi',
        changeLanguage: mockChangeLanguage,
      },
    });

    const { getByText } = render(<Settings />);

    expect(getByText('Finnish')).toBeTruthy(); 
    expect(getByText('✔️')).toBeTruthy();
  });

  it('initializes with "en" when current language is undefined', () => {
    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'settings.changeLanguage': 'Change Language',
          'settings.languages.english': 'English',
          'settings.languages.finnish': 'Finnish',
        };
        return translations[key] || key;
      },
      i18n: {
        language: '',
        changeLanguage: mockChangeLanguage,
      },
    });

    const { getByText } = render(<Settings />);

    expect(getByText('English')).toBeTruthy(); 
    expect(getByText('✔️')).toBeTruthy();
  });

  it('changes language when a language option is pressed', async () => {
    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'settings.changeLanguage': 'Change Language',
          'settings.languages.english': 'English',
          'settings.languages.finnish': 'Finnish',
        };
        return translations[key] || key;
      },
      i18n: {
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
    });

    const { getByText } = render(<Settings />);

    fireEvent.press(getByText('Finnish'));

    await waitFor(() => {
      expect(mockChangeLanguage).toHaveBeenCalledWith('fi');
    });
  });
});
