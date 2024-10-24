import { screen, render, fireEvent, waitFor } from "@testing-library/react-native";
import { NativeRouter } from "react-router-native";
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
        'signin.username': 'Käyttäjänimi'
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

  it('renders the sign-in page successfully', () => {
    const mockSetUsername = jest.fn();

    render(
      <NativeRouter>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NativeRouter>
    );

    screen.debug();

    expect(screen.getByPlaceholderText('Käyttäjänimi')).toBeDefined();
    expect(screen.getByText('Vahvista kirjautuminen')).toBeDefined();
  });

  it('calls onSubmit and saves username when the form is submitted', async () => {
    const mockSetUsername = jest.fn();

    axios.post.mockResolvedValue({
      data: { token: 'mockToken' }
    });

    render(
      <NativeRouter>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NativeRouter>
    );

    const input = screen.getByPlaceholderText('Käyttäjänimi');
    const button = screen.getByText('Vahvista kirjautuminen');

    fireEvent.changeText(input, 'testuser');
    fireEvent.press(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://tts-app.azurewebsites.net/api/signin/', {
        username: 'testuser'
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
      expect(mockSetUsername).toHaveBeenCalledWith('testuser');
    });
  });

  it('displays an error when empty form is submitted', async () => {
    const mockSetUsername = jest.fn();

    render(
      <NativeRouter>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NativeRouter>
    );

    fireEvent.press(screen.getByText('Vahvista kirjautuminen'));

    await waitFor(() => {
      expect(screen.getByText('Syötä käyttäjänimi')).toBeDefined();
    });
  });

  it('displays error when API call fails', async () => {
    const mockSetUsername = jest.fn();
    const mockError = new Error('Network Error');

    axios.post.mockRejectedValueOnce(mockError);

    render(
      <NativeRouter>
        <UserContext.Provider value={{ setUsername: mockSetUsername }}>
          <SignIn />
        </UserContext.Provider>
      </NativeRouter>
    );

    const input = screen.getByPlaceholderText('Käyttäjänimi');
    const button = screen.getByText('Vahvista kirjautuminen');

    fireEvent.changeText(input, 'testuser');
    fireEvent.press(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://tts-app.azurewebsites.net/api/signin/', {
        username: 'testuser'
      });

      expect(console.error).toHaveBeenCalledWith('Error signing in:', mockError);
    });
  });
});
