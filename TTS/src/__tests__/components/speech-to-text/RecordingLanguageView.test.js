import React from 'react';
import { render } from '@testing-library/react-native';
import RecordingLanguageView from '@components/speech-to-text/RecordingLanguageView';

const mockT = (key) => {
  const translations = {
    'speechtotext.recognitionLanguage': 'Recognition Language',
  };
  return translations[key] || key;
};

jest.mock('react-native-country-flag', () => {
    const { Text } = require('react-native');
    const MockedCountryFlag = () => <Text>MockedCountryFlag</Text>;
    return MockedCountryFlag;
});

describe('RecordingLanguageView Component', () => {
  it('renders correctly with the correct language flag', () => {
    const { getByText } = render(
      <RecordingLanguageView
        recordingLanguageFlagCode="US"
        t={mockT}
      />
    );

    expect(getByText('Recognition Language')).toBeTruthy();
    expect(getByText('MockedCountryFlag')).toBeTruthy();
  });

  it('renders the country flag with the correct iso code', () => {
    const { getByText } = render(
      <RecordingLanguageView
        recordingLanguageFlagCode="FR"
        t={mockT}
      />
    );

    expect(getByText('Recognition Language')).toBeTruthy();
    expect(getByText('MockedCountryFlag')).toBeTruthy();
  });
});
