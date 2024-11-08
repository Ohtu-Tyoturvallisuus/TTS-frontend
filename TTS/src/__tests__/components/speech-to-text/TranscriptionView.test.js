import React from 'react';
import { render } from '@testing-library/react-native';
import TranscriptionView from '@components/speech-to-text/TranscriptionView';

jest.mock('react-native-country-flag', () => {
    const { Text } = require('react-native');
    const MockedCountryFlag = () => <Text>MockedCountryFlag</Text>;
    return MockedCountryFlag;
});

describe('TranscriptionView Component', () => {
  it('renders correctly with the given transcription and flag code', () => {
    const transcription = 'This is a test transcription.';
    const { getByText } = render(
      <TranscriptionView 
        recordingLanguageFlagCode="US" 
        transcription={transcription} 
      />
    );

    expect(getByText(transcription)).toBeTruthy();
    expect(getByText('MockedCountryFlag')).toBeTruthy();
  });

  it('renders correctly with an empty transcription', () => {
    const { getByText } = render(
      <TranscriptionView 
        recordingLanguageFlagCode="FR" 
        transcription="" 
      />
    );

    expect(getByText('MockedCountryFlag')).toBeTruthy();
    expect(getByText('').textContent).toBeFalsy();
  });

  it('renders correctly with a different flag code and transcription', () => {
    const transcription = 'Ceci est une transcription de test.';
    const { getByText } = render(
      <TranscriptionView 
        recordingLanguageFlagCode="FR" 
        transcription={transcription} 
      />
    );

    expect(getByText(transcription)).toBeTruthy();
    expect(getByText('MockedCountryFlag')).toBeTruthy();
  });
});
