import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguageSelectMenu from '@components/speech-to-text/LanguageSelectMenu';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'languageselectmenu.selectRecordingLanguage': 'Valitse tunnistettava kieli',
        'languageselectmenu.selectTranslationLanguages': 'Valitse kielet, joille haluat kääntää',
        'languageselectmenu.selectLanguage': 'Valitse kieli',
        'languageselectmenu.selectLanguages': 'Valitse kielet',
        'languageselectmenu.selectedLanguage': 'Valittu kieli',
        'languageselectmenu.selectedLanguages': 'Valitut kielet',
        'languageselectmenu.searchLanguages': 'Hae kieliä...',
        'closebutton.close': 'Sulje'
      };
      return translations[key] || key;
    },
  }),
}));

describe('LanguageSelectMenu', () => {
  it('removes a selected language when clicked again', async () => {
    const mockSetRecordingLanguage = jest.fn();
    
    const { getByText, findByText, findByPlaceholderText } = render(
      <LanguageSelectMenu setRecordingLanguage={mockSetRecordingLanguage} />
    );

    fireEvent.press(getByText('Valitse tunnistettava kieli'));

    const searchInput = await findByPlaceholderText('Hae kieliä...');
    expect(searchInput).toBeTruthy();

    const suomiOption = await findByText('Suomi');
    fireEvent.press(suomiOption);

    fireEvent.press(suomiOption);

    const closeButton = getByText('Sulje');
    fireEvent.press(closeButton);

    expect(mockSetRecordingLanguage).toHaveBeenCalledWith('');
  });

  it('adds another language to the selected languages list', async () => {
    const mockSetTranslationLanguages = jest.fn();
    
    const { getByText, findByText, findByPlaceholderText } = render(
      <LanguageSelectMenu setTranslationLanguages={mockSetTranslationLanguages} />
    );

    fireEvent.press(getByText('Valitse kielet, joille haluat kääntää'));

    const searchInput = await findByPlaceholderText('Hae kieliä...');
    expect(searchInput).toBeTruthy();

    const suomiOption = await findByText('Suomi');
    fireEvent.press(suomiOption);

    const englantiOption = await findByText('English');
    fireEvent.press(englantiOption);

    const closeButton = getByText('Sulje');
    fireEvent.press(closeButton);

    expect(mockSetTranslationLanguages).toHaveBeenCalledWith(['fi', 'en']);
  });
});
