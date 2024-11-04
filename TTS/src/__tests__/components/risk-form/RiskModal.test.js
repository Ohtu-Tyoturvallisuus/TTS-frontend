import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskEditModal from '@components/risk-form/RiskEditModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'riskeditmodal.extraInfo': 'Syötä lisätietoja',
        'riskeditmodal.withSpeech': 'Syötä puheella',
        'riskeditmodal.cancel': 'Peruuta',
        'riskeditmodal.reset': 'Resetoi',
        'riskeditmodal.checked': 'Kunnossa',
        'languageselectmenu.selectRecordingLanguage': 'Valitse tunnistettava kieli',
        'languageselectmenu.selectTranslationLanguages': 'Valitse kielet, joille haluat kääntää'
      };
      return translations[key] || key;
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
      <RiskEditModal
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
      <RiskEditModal
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
      <RiskEditModal 
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
