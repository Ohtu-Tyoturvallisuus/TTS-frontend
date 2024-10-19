import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Audio } from 'expo-av';

import SpeechToTextView from '@components/speech-to-text/SpeechToTextView';

jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    setAudioModeAsync: jest.fn(),
    Recording: jest.fn(() => ({
      prepareToRecordAsync: jest.fn(),
      startAsync: jest.fn(),
      stopAndUnloadAsync: jest.fn(),
      getURI: jest.fn(() => 'mock-uri'),
    })),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations = {
        'speechtotext.maxLength': 'Maksimipituus',
        'speechtotext.seconds_one': 'yksi sekunti',
        'speechtotext.seconds_other': '{{count}} sekuntia',
        'speechtotext.stop': 'Lopeta',
        'speechtotext.start': 'Aloita puheentunnistus'
      };
      let translation = translations[key] || key;

      if (options && options.count !== undefined) {
        if (options.count === 1) {
          translation = translations[`${key}_one`] || translation;
        } else {
          translation = translations[`${key}_other`] || translation;
        }
        translation = translation.replace('{{count}}', options.count);
      }

      return translation;
    },
  }),
}));

jest.mock('@components/speech-to-text/LanguageSelectMenu', () => {
  return jest.fn(({ setRecordingLanguage, setTranslationLanguages }) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    
    return (
      <View>
        {setRecordingLanguage && (
          <Text onPress={() => setRecordingLanguage('fi-FI')}>
            Mocked Recording Language Select
          </Text>
        )}
        {setTranslationLanguages && (
          <Text onPress={() => setTranslationLanguages(['fi', 'sv'])}>
            Mocked Translation Language Select
          </Text>
        )}
      </View>
    );
  });
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        transcription: 'Test transcription',
        translations: {
          fi: 'Test Finnish translation',
          sv: 'Test Swedish translation',
        },
      }),
  })
);

function mockConsole() {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
}

jest.setTimeout(20000);

describe('SpeechToTextView Component', () => {
  beforeEach(() => {
    mockConsole();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const startRecording = (getByText, getAllByText) => {
    fireEvent.press(getAllByText('Mocked Recording Language Select')[0]);
    expect(getByText('(Maksimipituus: 60 sekuntia.)')).toBeTruthy();
    fireEvent.press(getByText('Aloita puheentunnistus'));
  };

  const stopRecording = async (getByText) => {
    await waitFor(() => {
      expect(getByText('Lopeta')).toBeTruthy();
    });
    fireEvent.press(getByText('Lopeta'));
  };

  it('renders and starts/stops recording correctly', async () => {
    const { getByText, getAllByText } = render(<SpeechToTextView />);

    startRecording(getByText, getAllByText);

    await waitFor(() => {
      expect(Audio.Recording).toHaveBeenCalled();
    });

    await stopRecording(getByText);
    await waitFor(() => expect(getByText('Test transcription')).toBeTruthy());
  });

  it('handles transcription and translation correctly', async () => {
    const { getByText, getAllByText } = render(<SpeechToTextView />);

    startRecording(getByText, getAllByText);
    await stopRecording(getByText);

    await waitFor(() => {
      expect(getByText('Test transcription')).toBeTruthy();
      expect(getByText('Test Finnish translation')).toBeTruthy();
      expect(getByText('Test Swedish translation')).toBeTruthy();
    });
  });

  it('calls setDescription with the transcription when provided', async () => {
    const mockSetDescription = jest.fn();
    const { getByText, getAllByText } = render(<SpeechToTextView setDescription={mockSetDescription} />);

    startRecording(getByText, getAllByText);
    await stopRecording(getByText);

    await waitFor(() => {
      expect(mockSetDescription).toHaveBeenCalledWith(expect.any(Function));
    });

    const updateFn = mockSetDescription.mock.calls[0][0];
    expect(updateFn('Previous description')).toBe('Previous description Test transcription');
    expect(updateFn('')).toBe('Test transcription');
  });

  it('catches error when failing to start recording', async () => {
    Audio.setAudioModeAsync.mockRejectedValueOnce(new Error('Failed to set audio mode'));

    const { getByText, getAllByText } = render(<SpeechToTextView />);

    startRecording(getByText, getAllByText);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to start recording', expect.any(Error));
    });
  });
});
