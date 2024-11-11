import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuthRequest } from 'expo-auth-session';
import MicrosoftSignIn from '@components/sign-in/MicrosoftSignIn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@contexts/UserContext';

jest.mock('expo-auth-session', () => ({
  useAuthRequest: jest.fn(),
  makeRedirectUri: jest.fn(() => 'mock_redirect_uri'),
}));

// Mock environment and constants for dynamic URL
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      local_ip: 'localhost',
      local_setup: 'false',
      environment: 'uat',  // You can change this to 'uat' or 'production' for different tests
    },
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@services/apiService', () => ({
  retrieveIdParams: jest.fn(),
  getUserProfile: jest.fn().mockResolvedValue(['John Doe', 'mock_id']),
  signIn: jest.fn().mockResolvedValue({ access_token: 'mock_access_token' }),
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
  const mockSetEmail = jest.fn();

  const renderWithContext = (username = null, email = null) => {
    return render(
      <UserContext.Provider value={{ username, setUsername: mockSetUsername, email, setEmail: mockSetEmail }}>
        <MicrosoftSignIn />
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, 'log').mockImplementation(() => {});

    const mockPromptAsync = jest.fn().mockResolvedValue({ 
      type: 'success', 
      params: { code: 'mock_code' } 
    });

    useAuthRequest.mockReturnValue([
      { codeVerifier: 'mock_code_verifier' },
      { type: 'success', params: { code: 'mock_code' } },
      mockPromptAsync,
    ]);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ access_token: 'mock_access_token' }),
    });
  });

  it('stores token in AsyncStorage on successful login', async () => {
    const { getByText } = renderWithContext();

    fireEvent.press(getByText('Microsoft sign-in'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/token'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('access_token', 'mock_access_token');
    });
  });

  it('displays greeting when username is present', () => {
    const { getByText } = renderWithContext('John Doe');
    expect(getByText('Hello, John Doe!')).toBeTruthy();
  });

  it('renders the sign-in button when no username is present', () => {
    const { getByText } = renderWithContext();
    expect(getByText('Microsoft sign-in')).toBeTruthy();
  });

  it('calls promptAsync when button is pressed', async () => {
    const { getByText } = renderWithContext();
    const signInButton = getByText('Microsoft sign-in');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(useAuthRequest()[2]).toHaveBeenCalled();
    });
  });

  it('handles authentication error gracefully', async () => {
    useAuthRequest.mockReturnValueOnce([
      { codeVerifier: 'mock_code_verifier' },
      { type: 'error', params: { error: 'invalid_request', error_description: 'Invalid credentials' } },
      jest.fn(),
    ]);
  
    const { getByText } = renderWithContext();
    fireEvent.press(getByText('Microsoft sign-in'));

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Authentication Error:', {
        type: 'error',
        params: { error: 'invalid_request', error_description: 'Invalid credentials' },
      });
    });
  });

  it('handles fetch error gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ error_description: 'Invalid token' }),
    });

    const { getByText } = renderWithContext();

    fireEvent.press(getByText('Microsoft sign-in'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(mockSetUsername).not.toHaveBeenCalled();
    });
  });

  it('handles network error gracefully', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    const { getByText } = renderWithContext();

    fireEvent.press(getByText('Microsoft sign-in'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(mockSetUsername).not.toHaveBeenCalled();
    });
  });
});