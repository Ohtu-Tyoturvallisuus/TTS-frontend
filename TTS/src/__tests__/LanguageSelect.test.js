import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguageSelectMenu from '../components/LanguageSelectMenu';

describe('LanguageSelectMenu', () => {
  it('calls setRecordingLanguage with the correct language when a language is selected', async () => {
    const mockSetRecordingLanguage = jest.fn();
    
    const { getByText, findByText, findByPlaceholderText } = render(
      <LanguageSelectMenu setRecordingLanguage={mockSetRecordingLanguage} />
    );

    fireEvent.press(getByText('Valitse tunnistettava kieli'));

    const searchInput = await findByPlaceholderText('Hae kieliä...');
    expect(searchInput).toBeTruthy();

    const suomiOption = await findByText('Suomi');
    fireEvent.press(suomiOption);

    const closeButton = getByText('Sulje');
    fireEvent.press(closeButton);

    expect(mockSetRecordingLanguage).toHaveBeenCalledWith('fi-FI');
  });
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

    const englantiOption = await findByText('Englanti');
    fireEvent.press(englantiOption);

    const closeButton = getByText('Sulje');
    fireEvent.press(closeButton);

    expect(mockSetTranslationLanguages).toHaveBeenCalledWith(['fi', 'en']);
  });
});
