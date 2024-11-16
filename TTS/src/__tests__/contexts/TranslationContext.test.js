import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { TranslationProvider, useTranslationLanguages } from '@contexts/TranslationContext';
import { useTranslation } from 'react-i18next';

// Mock useTranslation from react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Test component to use the TranslationContext values
const TestComponent = () => {
  const { fromLang, setFromLang, toLangs, setToLangs } = useTranslationLanguages();
  const { Text, Button } = require('react-native');

  return (
    <>
      <Text testID="fromLang">{fromLang}</Text>
      <Text testID="toLangs">{toLangs.join(', ')}</Text>
      <Button title="Set French" onPress={() => setFromLang('fr')} />
      <Button title="Add English to toLangs" onPress={() => setToLangs(['en'])} />
    </>
  );
};

describe('TranslationProvider Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with fromLang based on i18n.language', () => {
    useTranslation.mockReturnValue({ i18n: { language: 'en-US' } });
    
    const { getByTestId } = render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    expect(getByTestId('fromLang').props.children).toBe('en');
    expect(getByTestId('toLangs').props.children).toBe('');
  });

  it('updates fromLang when i18n.language changes', () => {
    const mockI18n = { language: 'en-US' };
    useTranslation.mockReturnValue({ i18n: mockI18n });

    const { getByTestId, rerender } = render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    // Initial check
    expect(getByTestId('fromLang').props.children).toBe('en');

    // Simulate language change
    act(() => {
      mockI18n.language = 'fr-FR';
      rerender(
        <TranslationProvider>
          <TestComponent />
        </TranslationProvider>
      );
    });

    // Verify that fromLang has updated
    expect(getByTestId('fromLang').props.children).toBe('fr');
  });

  it('allows fromLang to be manually updated', () => {
    useTranslation.mockReturnValue({ i18n: { language: 'en-US' } });

    const { getByTestId, getByText } = render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    expect(getByTestId('fromLang').props.children).toBe('en');

    // Press button to change fromLang to 'fr'
    act(() => {
      fireEvent.press(getByText('Set French'));
    });

    expect(getByTestId('fromLang').props.children).toBe('fr');
  });

  it('updates toLangs correctly', () => {
    useTranslation.mockReturnValue({ i18n: { language: 'en-US' } });

    const { getByTestId, getByText } = render(
      <TranslationProvider>
        <TestComponent />
      </TranslationProvider>
    );

    expect(getByTestId('toLangs').props.children).toBe('');

    // Press button to set toLangs to ['en']
    act(() => {
      fireEvent.press(getByText('Add English to toLangs'));
    });

    expect(getByTestId('toLangs').props.children).toBe('en');
  });
});
