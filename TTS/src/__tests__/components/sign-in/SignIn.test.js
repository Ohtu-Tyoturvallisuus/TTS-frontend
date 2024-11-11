import { screen, render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SignIn from "@components/sign-in/SignIn";
import { UserContext } from "@contexts/UserContext";

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('axios');

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      local_ip: 'localhost',
      local_setup: 'false'
    }
  }
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'signin.confirmLogin': 'Vahvista kirjautuminen',
        'signin.first_name': 'Etunimi',
        'signin.last_name': 'Sukunimi',
        'signin.guestSignInButton': 'Kirjaudu vieraskäyttäjänä',
        'signin.close': 'Sulje'
      };
      return translations[key] || key;
    },
  }),
}));

console.error = jest.fn();

describe('Sign in', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign-in page successfully and opens and closes modal', () => {
    const mockSetUsername = jest.fn();

    render(
      <NavigationContainer>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NavigationContainer>
    );

    expect(screen.getByText('Kirjaudu vieraskäyttäjänä')).toBeDefined();
    fireEvent.press(screen.getByText('Kirjaudu vieraskäyttäjänä'));
    expect(screen.getByText('Sulje')).toBeDefined();
    fireEvent.press(screen.getByText('Sulje'));
  });

  it('calls onSubmit and saves username when the form is submitted', async () => {
    const mockSetUsername = jest.fn();

    axios.post.mockResolvedValue({
      data: { token: 'mockToken' }
    });

    render(
      <NavigationContainer>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NavigationContainer>
    );

    fireEvent.press(screen.getByText('Kirjaudu vieraskäyttäjänä'));

    const firstNameInput = screen.getByPlaceholderText('Etunimi');
    const lastNameInput = screen.getByPlaceholderText('Sukunimi');
    const button = screen.getByText('Vahvista kirjautuminen');

    fireEvent.changeText(firstNameInput, 'testuser');
    fireEvent.changeText(lastNameInput, 'testuser');
    fireEvent.press(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://tts-app-uat.azurewebsites.net/api/signin/', {
        username: 'testuser testuser',
        id: null,
        guest: true
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'testuser testuser');
      expect(mockSetUsername).toHaveBeenCalledWith('testuser testuser');
    });
  });

  it('displays an error when empty form is submitted', async () => {
    const mockSetUsername = jest.fn();

    render(
      <NavigationContainer>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NavigationContainer>
    );

    fireEvent.press(screen.getByText('Kirjaudu vieraskäyttäjänä'));

    fireEvent.press(screen.getByText('Vahvista kirjautuminen'));

    await waitFor(() => {
      expect(screen.getByText('signin.error_first_name')).toBeDefined();
      expect(screen.getByText('signin.error_last_name')).toBeDefined();
    });
  });

  it('displays error when API call fails', async () => {
    const mockSetUsername = jest.fn();
    const mockError = new Error('Network Error');

    axios.post.mockRejectedValueOnce(mockError);

    render(
      <NavigationContainer>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NavigationContainer>
    );

    fireEvent.press(screen.getByText('Kirjaudu vieraskäyttäjänä'));

    const firstNameInput = screen.getByPlaceholderText('Etunimi');
    const lastNameInput = screen.getByPlaceholderText('Sukunimi');
    const button = screen.getByText('Vahvista kirjautuminen');

    fireEvent.changeText(firstNameInput, 'testuser');
    fireEvent.changeText(lastNameInput, 'testuser');
    fireEvent.press(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://tts-app-uat.azurewebsites.net/api/signin/', {
        username: 'testuser testuser',
        id: null,
        guest: true
      });

      expect(console.error).toHaveBeenCalledWith('Error signing in:', mockError);
    });
  });
});