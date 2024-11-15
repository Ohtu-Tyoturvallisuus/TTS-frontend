import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UserContext } from '@contexts/UserContext';
import Settings from '@components/settings/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key) => {
        const translations = {
          'settings.changeLanguage': 'Change language',
          'settings.signOut': 'Sign Out',
          'settings.signIn': 'Sign In',
          'changelanguage.changeLanguage': 'Select your language',
          'changelanguage.languages.english': 'English',
          'changelanguage.languages.finnish': 'Finnish',
          'closebutton.close': 'Close',
        };
        return translations[key] || key;
      },
      i18n: {
        language: 'en',
        changeLanguage: jest.fn(),
      },
    }),
  }));

describe('Settings Component', () => {
  const mockSetUsername = jest.fn();
  const mockSetEmail = jest.fn();
  const mockNavigate = jest.fn();

  const renderWithContext = (username = null, email = null) => {
    return render(
      <UserContext.Provider value={{ username, setUsername: mockSetUsername, email, setEmail: mockSetEmail }}>
        <Settings />
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({ navigate: mockNavigate });
  });

  it('renders correctly with username and email', () => {
    const { getByText } = renderWithContext('John Doe', 'john.doe@example.com');

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john.doe@example.com')).toBeTruthy();
  });

  it('renders correctly without username and email', () => {
    const { getByText } = renderWithContext();

    expect(getByText('Change language')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('handles sign out correctly', async () => {
    const { getByText } = renderWithContext('John Doe', 'john.doe@example.com');

    fireEvent.press(getByText('Sign Out'));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('username');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('email');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockSetUsername).toHaveBeenCalledWith(null);
      expect(mockSetEmail).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('Main');
    });
  });

  it('logs error when sign out fails', async () => {
    console.error = jest.fn();
    AsyncStorage.removeItem.mockImplementationOnce(() => {
      throw new Error('Failed to remove username');
    });

    const { getByText } = renderWithContext('John Doe', 'john.doe@example.com');
    fireEvent.press(getByText('Sign Out'));

    await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
        expect(console.error.mock.calls[0][1].message).toBe('Failed to remove username');
      });
  });

  it('navigates to CombinedSignIn when sign-in button is pressed', () => {
    const { getByText } = renderWithContext();

    fireEvent.press(getByText('Sign In'));

    expect(mockNavigate).toHaveBeenCalledWith('CombinedSignIn');
  });

  it('calls setSettingsVisible when change language button is pressed', () => {
    const { getByText } = renderWithContext('John Doe', 'john.doe@example.com');

    expect(getByText('Change language')).toBeTruthy();
    fireEvent.press(getByText('Change language'));
    expect(getByText('Select your language')).toBeTruthy();

    fireEvent.press(getByText('Close'));
    expect(getByText('Change language')).toBeTruthy();
  });

  it('handles onRequestClose for the modal', () => {
    const { getByText, queryByText, getByTestId } = renderWithContext('John Doe', 'john.doe@example.com');
  
    fireEvent.press(getByText('Change language'));
    expect(getByText('Select your language')).toBeTruthy();
  
    fireEvent(getByTestId('change-language-modal'), 'requestClose');
  
    expect(queryByText('Select your language')).toBeNull();
  });
});
