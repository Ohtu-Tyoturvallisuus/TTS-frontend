import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskModal from '@components/risk-form/RiskModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'riskmodal.extraInfo': 'Syötä lisätietoja',
        'riskmodal.withSpeech': 'Syötä puheella',
        'riskmodal.cancel': 'Peruuta',
        'riskmodal.reset': 'Resetoi',
        'riskmodal.checked': 'Kunnossa',
        'speechtotext.recognitionLanguage': 'Puheentunnistuskieli',
        'speechtotext.stop': 'Lopeta',
        'speechtotext.start': 'Aloita puheentunnistus',
        'speechtotext.maxLength': 'Maksimipituus',
        'speechtotext.seconds': '{{count}} sekuntia',
        'selecttranslate.selectTranslationLanguages': 'Valitse kielet käännöstä varten'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'fi-FI',
      changeLanguage: jest.fn().mockResolvedValue(true),
    },
  }),
}));

describe('RiskModal Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockTitle = "Test Modal Title";

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
  });

  it('renders modal with title and closes when "Peruuta" is pressed', () => {
    const { getByText } = render(
      <RiskModal
        title={mockTitle}
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(getByText(mockTitle)).toBeTruthy();
    expect(getByText('Peruuta')).toBeTruthy();

    fireEvent.press(getByText('Peruuta'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with description when "Kunnossa" is pressed', () => {
    const { getByText, getByPlaceholderText } = render(
      <RiskModal
        title={mockTitle}
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const input = getByPlaceholderText('Syötä lisätietoja');

    fireEvent.changeText(input, 'This is a test description');

    fireEvent.press(getByText('Kunnossa'));

    expect(mockOnSubmit).toHaveBeenCalledWith('This is a test description');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should toggle useSpeech and hide the button when "Syötä puheella" is pressed', () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnReset = jest.fn();

    const { getByText, queryByText } = render(
      <RiskModal 
        title="Test Risk" 
        visible={true} 
        initialDescription="Test description" 
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        isModification={false}
      />
    );

    const speechButton = getByText('Syötä puheella');
    expect(speechButton).toBeTruthy();

    fireEvent.press(speechButton);

    expect(queryByText('Syötä puheella')).toBeNull();

    const recordingLanguageText = getByText('Puheentunnistuskieli');
    expect(recordingLanguageText).toBeTruthy();
    const translatedLanguagesText = getByText('Valitse kielet käännöstä varten');
    expect(translatedLanguagesText).toBeTruthy();
  });
});
