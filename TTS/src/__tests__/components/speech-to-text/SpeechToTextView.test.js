import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Audio } from 'expo-av';

import SpeechToTextView from '@components/speech-to-text/SpeechToTextView';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations = {
        'speechtotext.maxLength': 'Maksimipituus',
        'speechtotext.recognitionLanguage': 'Puheentunnistuskieli',
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
    i18n: {
      language: 'fi-FI',
      changeLanguage: jest.fn().mockResolvedValue(true),
    },
  }),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      local_ip: '192.168.1.1',
      local_setup: 'true',
    },
  },
}));

jest.mock('@components/speech-to-text/SelectTranslateLanguage', () => {
  return jest.fn(({ setTranslationLanguages }) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    
    return (
      <View>
          <Text onPress={() => setTranslationLanguages(['fi', 'sv'])}>
            Mocked Translation Language Select
          </Text>
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

  const startRecording = (getByText) => {
    expect(getByText('Puheentunnistuskieli')).toBeTruthy();
    expect(getByText('Aloita puheentunnistus')).toBeTruthy();
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

  it('catches error when failing to upload file', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Upload failed')));

    const { getByText, getAllByText } = render(<SpeechToTextView />);

    startRecording(getByText, getAllByText);
    await stopRecording(getByText);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to upload file:', expect.any(Error));
    });
  });

  it('catches error when permission is denied', async () => {
    Audio.requestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

    const { getByText, getAllByText } = render(<SpeechToTextView />);

    startRecording(getByText, getAllByText);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Permission to access audio was denied');
    });
  });

  it('handles server errors during upload correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error: "Invalid or expired token",
          }),
        ok: false,
      })
    );

    const { getByText } = render(<SpeechToTextView />);

    fireEvent.press(getByText('Aloita puheentunnistus'));

    await waitFor(() => {
      expect(getByText('Lopeta')).toBeTruthy();
    });
    fireEvent.press(getByText('Lopeta'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Invalid or expired token. Please log in again.");
    });
  });

  it('handles other server errors during upload correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error: "Some other error occurred",
          }),
        ok: false,
      })
    );

    const { getByText } = render(<SpeechToTextView />);

    fireEvent.press(getByText('Aloita puheentunnistus'));

    await waitFor(() => {
      expect(getByText('Lopeta')).toBeTruthy();
    });
    fireEvent.press(getByText('Lopeta'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error from server:", "Some other error occurred");
    });
  });
});