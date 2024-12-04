import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FormValidationView from '@components/risk-form/FormValidationView';
import { getAccountsBySurvey, patchSurveyCompletion } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';
import { NavigationContext } from '@contexts/NavigationContext';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';

jest.mock('@services/apiService', () => ({
    getAccountsBySurvey: jest.fn(() =>
      Promise.resolve({ accounts: [{ account: { user_id: '1', username: 'User1' }, filled_at: '2024-12-03T12:00:00Z' }] })
    ),
    patchSurveyCompletion: jest.fn(() => Promise.resolve()),
  }));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en' },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

jest.mock('@contexts/FormContext', () => {
  const mockFormContext = {
    formData: {
      personal_protection: { description: 'Mock Description', status: '', risk_type: 'scaffolding' },
    },
    resetFormData: jest.fn(),
    updateFormField: jest.fn(),
    replaceFormData: jest.fn(),
    updateTranslations: jest.fn(),
    task: ['Mock Task'],
    setTask: jest.fn(),
    scaffoldType: ['Mock Scaffold Type'],
    setScaffoldType: jest.fn(),
    taskDesc: 'Mock Task Description',
    setTaskDesc: jest.fn(),
    accessCode: '12345',
    setAccessCode: jest.fn(),
  };

  return {
    FormContext: {
      Provider: ({ children }) => <>{children}</>, // Mock the Provider
    },
    useFormContext: () => mockFormContext,
  };
});
  

const mockAccounts = [
  { account: { user_id: '1', username: 'User1' }, filled_at: '2024-12-03T12:00:00Z' },
  { account: { user_id: '2', username: 'User2' }, filled_at: '2024-12-03T12:10:00Z' },
];

const mockContextValues = {
  selectedProject: { project_name: 'Project A', project_id: '123' },
  selectedSurveyId: '456',
  resetProjectAndSurvey: jest.fn(),
};

jest.mock('@components/risk-form/FilledRiskForm', () => 'FilledRiskForm');

jest.mock('@components/SuccessAlert', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const SuccessAlert = () => <Text testID="success-alert">Mocked SuccessAlert</Text>;
  SuccessAlert.displayName = 'SuccessAlert';
  return SuccessAlert;
});

describe('FormValidationView Component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <UserContext.Provider value={{ newUserSurveys: false, setNewUserSurveys: jest.fn() }}>
        <NavigationContext.Provider value={{ setCurrentLocation: jest.fn() }}>
          <ProjectSurveyContext.Provider value={mockContextValues}>
            <FormValidationView />
          </ProjectSurveyContext.Provider>
        </NavigationContext.Provider>
      </UserContext.Provider>
    );

  it('renders correctly and fetches accounts', async () => {
    getAccountsBySurvey.mockResolvedValueOnce({ accounts: mockAccounts });

    const { getByText, queryByTestId } = renderComponent();

    expect(queryByTestId('loading-indicator')).not.toBeNull();

    await waitFor(() => {
      expect(getByText(/User1/i)).toBeTruthy();
      expect(getByText(/User2/i)).toBeTruthy();
    });

    expect(getAccountsBySurvey).toHaveBeenCalledWith('456');
  });

  it('marks the survey as completed', async () => {
    getAccountsBySurvey.mockResolvedValueOnce({ accounts: mockAccounts });
    patchSurveyCompletion.mockResolvedValueOnce();
  
    const { getByText } = renderComponent();
  
    await waitFor(() => expect(getByText(/User1/i)).toBeTruthy());
  
    fireEvent.press(getByText('formvalidation.done'));  
    fireEvent.press(getByText('formvalidation.confirm'));
    await waitFor(() => expect(patchSurveyCompletion).toHaveBeenCalledWith('456', 2));
  });

  it('shows success alert after marking the survey as completed', async () => {
    getAccountsBySurvey.mockResolvedValueOnce({ accounts: mockAccounts });
    patchSurveyCompletion.mockResolvedValueOnce();
  
    const { getByText, findByText } = renderComponent();
  
    await waitFor(() => expect(getByText(/User1/i)).toBeTruthy());
  
    fireEvent.press(getByText('formvalidation.done'));
    fireEvent.press(getByText('formvalidation.confirm'));

    const successAlert = await findByText('Mocked SuccessAlert');
    expect(successAlert).toBeTruthy();
  });

  it('handles errors gracefully during account fetching', async () => {
    getAccountsBySurvey.mockRejectedValueOnce(new Error('Failed to fetch accounts'));

    const { queryByText } = renderComponent();

    await waitFor(() => {
      expect(queryByText(/User1/i)).toBeNull();
    });

    expect(console.error).toHaveBeenCalledWith('Error fetching accounts:', expect.any(Error));
  });

  it('handles errors gracefully during survey completion', async () => {
    getAccountsBySurvey.mockResolvedValueOnce({ accounts: mockAccounts });
    patchSurveyCompletion.mockRejectedValueOnce(new Error('Failed to complete survey'));
  
    const { getByText } = renderComponent();
  
    await waitFor(() => expect(getByText(/User1/i)).toBeTruthy());
  
    fireEvent.press(getByText('formvalidation.done'));
    fireEvent.press(getByText('formvalidation.confirm'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error marking survey as completed:',
        expect.any(Error)
      );
    });
  });
});
