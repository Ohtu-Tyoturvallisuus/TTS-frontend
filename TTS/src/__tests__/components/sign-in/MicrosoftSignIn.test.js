import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthRequest } from 'expo-auth-session';
import MicrosoftSignIn from '@components/sign-in/MicrosoftSignIn';
import { UserContext } from '@contexts/UserContext';

jest.mock('expo-auth-session', () => ({
  useAuthRequest: jest.fn(),
  makeRedirectUri: jest.fn(() => 'mock_redirect_uri'),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@services/apiService', () => ({
  retrieveIdParams: jest.fn(),
  getUserProfile: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key) => {
        const translations = {
            'microsoftsignin.signInText': 'Microsoft sign-in',
            'microsoftsignin.greeting': 'Hello',
          };
          
        return translations[key] || key;
      },
    }),
  }));
  

describe('MicrosoftSignIn Component', () => {
  const mockSetUsername = jest.fn();

  const renderWithContext = (username = null) => {
    return render(
      <UserContext.Provider value={{ username, setUsername: mockSetUsername }}>
        <MicrosoftSignIn />
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const mockPromptAsync = jest.fn().mockResolvedValue({ type: 'success', params: { code: 'mock_code' } });

    useAuthRequest.mockReturnValue([
      { codeVerifier: 'mock_code_verifier' },
      { type: 'unknown' },
      mockPromptAsync,
    ]);
  });

  it('renders the sign-in button when no username is present', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Microsoft sign-in')).toBeTruthy();
  });

  it('displays greeting when username is present', () => {
    const { getByText } = renderWithContext('John Doe');
    expect(getByText('Hello, John Doe!')).toBeTruthy();
  });  

  it('calls promptAsync when button is pressed', async () => {
    const { getByText } = renderWithContext();
    const signInButton = getByText('Microsoft sign-in');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(useAuthRequest()[2]).toHaveBeenCalled();
    });
  });
});
