import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import JoinSurvey from '@components/risk-form/JoinSurvey';
import { UserContext } from '@contexts/UserContext';
import { getSurveyByAccessCode } from '@services/apiService';

jest.mock('@services/apiService', () => ({
  getSurveyByAccessCode: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('JoinSurvey Component', () => {
  const mockSetJoinedSurvey = jest.fn();

  const renderComponent = (joinedSurvey = false) => {
    return render(
      <UserContext.Provider value={{ joinedSurvey, setJoinedSurvey: mockSetJoinedSurvey }}>
        <JoinSurvey />
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    expect(getByText('joinsurvey.insertCode')).toBeTruthy();
    expect(getByPlaceholderText('joinsurvey.insertPlaceholder')).toBeTruthy();
    expect(getByText('joinsurvey.join')).toBeTruthy();
  });

  it('validates the form and shows an error if the access code is empty', async () => {
    const { getByText } = renderComponent();

    const joinButton = getByText('joinsurvey.join');
    fireEvent.press(joinButton);

    await waitFor(() => {
      expect(getByText('joinsurvey.error')).toBeTruthy();
    });
  });

  it('validates the form and shows an error for invalid access code length', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    const input = getByPlaceholderText('joinsurvey.insertPlaceholder');
    fireEvent.changeText(input, '123');

    const joinButton = getByText('joinsurvey.join');
    fireEvent.press(joinButton);

    await waitFor(() => {
      expect(getByText('joinsurvey.error_length')).toBeTruthy();
    });
  });

  it('handles successful API call and updates the context', async () => {
    getSurveyByAccessCode.mockResolvedValueOnce({
      risk_notes: 'Sample risk notes',
      project_name: 'Project A',
      project_id: 1,
      description: 'Sample description',
      scaffold_type: 'Type A',
      task: 'Task A',
    });

    const { getByText, getByPlaceholderText } = renderComponent();

    const input = getByPlaceholderText('joinsurvey.insertPlaceholder');
    fireEvent.changeText(input, '123456');

    const joinButton = getByText('joinsurvey.join');
    fireEvent.press(joinButton);

    await waitFor(() => {
      expect(mockSetJoinedSurvey).toHaveBeenCalledWith(true);
      expect(getSurveyByAccessCode).toHaveBeenCalledWith('123456');
    });
  });

  it('handles API failure and displays an error message', async () => {
    getSurveyByAccessCode.mockRejectedValueOnce(new Error('API Error'));

    const { getByText, getByPlaceholderText } = renderComponent();

    const input = getByPlaceholderText('joinsurvey.insertPlaceholder');
    fireEvent.changeText(input, '123456');

    const joinButton = getByText('joinsurvey.join');
    fireEvent.press(joinButton);

    await waitFor(() => {
      expect(getByText('joinsurvey.fetchError')).toBeTruthy();
      expect(mockSetJoinedSurvey).not.toHaveBeenCalled();
    });
  });
});
