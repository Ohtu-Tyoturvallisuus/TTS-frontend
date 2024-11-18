import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyObservations from '@components/settings/MyObservations';
import useUserSurveys from '@hooks/useUserSurveys';
import { formatDate } from '@utils/dateUtils';

jest.mock('@hooks/useUserSurveys', () => jest.fn());

jest.mock('@utils/dateUtils', () => ({
  formatDate: jest.fn(() => ({
    date: '01.11.2024',
    time: '10:00',
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'myobservations.title': 'Omat havaintoni',
        'myobservations.loading': 'Ladataan havaintoja...',
      };
      return translations[key] || key;
    }
  }),
}));

jest.mock('@components/buttons/SettingsButton', () => jest.fn(({ onPress, text }) => {
  const { View, Text } = require('react-native');
  return (
    <View>
      <Text testID="settings-button" onPress={onPress}>
        {text}
      </Text>
    </View>
  );
}));

jest.mock('@components/buttons/CloseButton', () => jest.fn(({ onPress }) => {
  const { View, Text } = require('react-native');
  return (
    <View>
      <Text testID="close-button" onPress={onPress}>
        Close
      </Text>
    </View>
  );
}));

jest.mock('@components/risk-form/FilledRiskForm', () => jest.fn(({ formattedDate }) => {
  const { View, Text } = require('react-native');
  return (
    <View>
      <Text testID={`filled-risk-form-${formattedDate.date}`}>
        {formattedDate.date}
      </Text>
    </View>
  );
}));

jest.mock('@components/Loading', () => jest.fn(({ loading, error, title }) => {
  const { View, Text } = require('react-native');
  return (
    <View>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <Text>{title}</Text>
    </View>
  );
}));

describe('MyObservations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    useUserSurveys.mockReturnValue({
      userSurveys: [],
      loading: true,
      error: null,
    });

    const { getByText } = render(<MyObservations />);

    expect(getByText('Ladataan havaintoja...')).toBeTruthy();
  });

  it('should render error state if there is an error', () => {
    useUserSurveys.mockReturnValue({
      userSurveys: [],
      loading: false,
      error: 'Failed to load surveys',
    });

    const { getByText } = render(<MyObservations />);

    expect(getByText('Error: Failed to load surveys')).toBeTruthy();
  });

  it('should render surveys when loaded', async () => {
    const mockSurveys = [
      { id: 1, created_at: '2024-11-01T10:00:00Z', risk_notes: [], project_name: 'Project A' },
    ];
  
    useUserSurveys.mockReturnValue({
      userSurveys: mockSurveys,
      loading: false,
      error: null,
    });
  
    const { getByTestId, getByText } = render(<MyObservations />);
  
    fireEvent.press(getByTestId('settings-button'));
  
    await waitFor(() => {
      expect(formatDate).toHaveBeenCalledWith(mockSurveys[0].created_at);
      expect(getByText('01.11.2024')).toBeTruthy();
    });
  });

  it('should close modal when CloseButton is pressed', async () => {
    useUserSurveys.mockReturnValue({
      userSurveys: [],
      fetchUserSurveys: jest.fn(),
      loading: false,
      error: null,
    });

    const { getByTestId, queryByTestId } = render(<MyObservations />);

    fireEvent.press(getByTestId('settings-button'));

    await waitFor(() => {
      expect(queryByTestId('close-button')).toBeTruthy();
    });

    fireEvent.press(getByTestId('close-button'));

    await waitFor(() => {
      expect(queryByTestId('close-button')).toBeFalsy();
    });
  });

  it('handles onRequestClose for the modal', async () => {
    useUserSurveys.mockReturnValue({
      userSurveys: [],
      fetchUserSurveys: jest.fn(),
      loading: false,
      error: null,
    });
  
    const { getByTestId, queryByTestId } = render(<MyObservations />);

    fireEvent.press(getByTestId('settings-button'));

    await waitFor(() => {
      expect(getByTestId('myobservations-modal')).toBeTruthy();
    });

    fireEvent(getByTestId('myobservations-modal'), 'requestClose');

    await waitFor(() => {
      expect(queryByTestId('myobservations-modal')).toBeNull();
    });
  });
});
  
