import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectTranslateLanguage from '@components/speech-to-text/SelectTranslateLanguage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'selecttranslate.selectTranslationLanguages': 'Select translation languages',
        'selecttranslate.selectLanguages': 'Select languages',
        'selecttranslate.searchLanguages': 'Search languages...',
        'selecttranslate.selectedLanguages': 'Selected languages:',
        'closebutton.close': 'Close',
      };
      return translations[key] || key;
    },
  }),
}));

describe('SelectTranslateLanguage Component', () => {
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
    fireEvent.changeText(searchInput, 'Suomi');
    const suomiOption = await findByText('Suomi');
    expect(suomiOption).toBeTruthy();
  });

  it('selects a language and displays it as selected', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'Suomi');

    fireEvent.press(getByText('Suomi'));
    expect(getByText('✓')).toBeTruthy(); // Expect the checkmark to be there
  });

  it('removes a selected language when clicked again', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText, findByText, queryByText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));
    
    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'Suomi');

    const suomiOption = await findByText('Suomi');
    fireEvent.press(suomiOption); // Select it

    fireEvent.press(suomiOption); // Press again to remove it

    // Check that the checkmark is no longer displayed
    expect(queryByText('✓')).toBeNull(); // Use queryByText for not found check
  });

  it('calls setTranslationLanguages with the selected languages when modal is closed', async () => {
    const mockSetTranslationLanguages = jest.fn();
    const { getByText, findByPlaceholderText } = render(
      <SelectTranslateLanguage setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Select translation languages'));

    const searchInput = await findByPlaceholderText('Search languages...');
    fireEvent.changeText(searchInput, 'Suomi');

    const suomiOption = getByText('Suomi');
    fireEvent.press(suomiOption); // Select 'Suomi'

    fireEvent.press(getByText('Close')); // Close the modal
    expect(mockSetTranslationLanguages).toHaveBeenCalledWith(['fi']);
  });
});
