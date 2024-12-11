import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectTranslateLanguage from '@components/speech-to-text/SelectTranslateLanguage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'selecttranslate.selectTranslationLanguages': 'Select translation languages',
        'selecttranslate.selectedTranslationLanguages': 'Selected languages for translation',
        'selecttranslate.selectLanguages': 'Select languages',
        'selecttranslate.searchLanguages': 'Search languages...',
        'selecttranslate.selectedLanguages': 'Selected languages:',
        'general.done': 'Done',
      };
      return translations[key] || key;
    },
  }),
}));

const TranslationContext = jest.requireActual('@contexts/TranslationContext');
const originalUseTranslationLanguages = TranslationContext.useTranslationLanguages;

jest.mock('@contexts/TranslationContext', () => ({
  useTranslationLanguages: jest.fn(() => ({
    fromLang: 'fi',
    toLangs: [],
  })),
}));

describe('SelectTranslateLanguage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and opens the modal when button is pressed', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    const modalLabel = await findByText('Select languages:');
    expect(modalLabel).toBeTruthy();
  });

  it('allows searching for languages', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText, findByText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'Svenska');
    const svenskaOption = await findByText('Svenska');
    expect(svenskaOption).toBeTruthy();
  });

  it('selects a language and displays it as selected', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText, queryByTestId } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'English');

    fireEvent.press(getByText('English'));
    expect(queryByTestId('check-icon')).toBeTruthy(); // Expect the checkmark icon to be there
  });

  it('removes a selected language when clicked again', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText, findByText, queryByTestId } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    
    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'English');

    const englishOption = await findByText('English');
    fireEvent.press(englishOption); // Select it

    fireEvent.press(englishOption); // Press again to remove it

    // Check that the checkmark is no longer displayed
    expect(queryByTestId('check-icon')).toBeNull(); // Use queryByTestId for not found check
  });

  it('calls setTranslationLanguages with the selected languages when modal is closed', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));

    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'English');

    const englishOption = getByText('English');
    fireEvent.press(englishOption); // Select 'English'

    fireEvent.press(getByText('Done')); // Close the modal
    expect(mockSetTranslationLanguages).toHaveBeenCalledWith(['en']);
  });

  it('does not allow selecting the form language as a translation language', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText, queryByText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'Suomi');

    // Ensure 'Suomi' (form language) is not selectable
    expect(queryByText('Suomi')).toBeNull();
  });

  it('falls back to the default country when fromLang is not in the countries list', async () => {
    const useTranslationLanguagesMock = require('@contexts/TranslationContext').useTranslationLanguages;
    useTranslationLanguagesMock.mockImplementation(() => ({
      fromLang: 'de', // German, not in the countries list
      toLangs: [],
    }));

    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText, queryByText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'Suomi');

    // Ensure default country ('Suomi') is not selectable
    expect(queryByText('Suomi')).toBeNull();

    useTranslationLanguagesMock.mockImplementation(originalUseTranslationLanguages);
  });
});
