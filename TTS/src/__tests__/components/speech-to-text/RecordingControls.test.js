import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RecordingControls from '@components/speech-to-text/RecordingControls';

const mockT = (key) => {
  const translations = {
    'speechtotext.start': 'Start Recording',
    'speechtotext.stop': 'Stop Recording',
  };
  return translations[key] || key; // Return the translation or the key itself if not found
};
  
describe('RecordingControls Component', () => {
  let mockStartRecording;
  let mockStopRecording;

  beforeEach(() => {
    mockStartRecording = jest.fn();
    mockStopRecording = jest.fn();
  });

  it('renders start button when not recording', () => {
    const { getByText } = render(
      <RecordingControls
        recording={false}
        startRecording={mockStartRecording}
        stopRecording={mockStopRecording}
        t={mockT}
      />
    );

    expect(getByText('Start Recording')).toBeTruthy();
  });

  it('renders stop button when recording', () => {
    const { getByText } = render(
      <RecordingControls
        recording={true}
        startRecording={mockStartRecording}
        stopRecording={mockStopRecording}
        t={mockT}
      />
    );

    expect(getByText('Stop Recording')).toBeTruthy();
  });

  it('calls startRecording when the start button is pressed', () => {
    const { getByText } = render(
      <RecordingControls
        recording={false}
        startRecording={mockStartRecording}
        stopRecording={mockStopRecording}
        t={mockT}
      />
    );

    fireEvent.press(getByText('Start Recording'));
    expect(mockStartRecording).toHaveBeenCalled();
    expect(mockStopRecording).not.toHaveBeenCalled();
  });

  it('calls stopRecording when the stop button is pressed', () => {
    const { getByText } = render(
      <RecordingControls
        recording={true}
        startRecording={mockStartRecording}
        stopRecording={mockStopRecording}
        t={mockT}
      />
    );

    fireEvent.press(getByText('Stop Recording'));
    expect(mockStopRecording).toHaveBeenCalled();
    expect(mockStartRecording).not.toHaveBeenCalled();
  });
});
