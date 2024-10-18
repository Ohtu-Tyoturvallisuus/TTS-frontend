import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MemoryRouter } from 'react-router-native';
import AppBar from '@components/app-bar/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

// Mock console.error to verify error handling
console.error = jest.fn();

describe('AppBar Component', () => {
  const mockSetUsername = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('removes username from AsyncStorage and calls setUsername with null on sign out', async () => {
    AsyncStorage.removeItem.mockResolvedValueOnce(null);

    const { getByText } = render(
      <MemoryRouter>
        <AppBar username="testUser" setUsername={mockSetUsername} />
      </MemoryRouter>
    );

    const signOutButton = getByText('Kirjaudu ulos');
    fireEvent.press(signOutButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('username');
    expect(mockSetUsername).toHaveBeenCalledWith(null);
  }, 10000);

  it('logs error when AsyncStorage.removeItem fails', async () => {
    const mockError = new Error('AsyncStorage error');
    AsyncStorage.removeItem.mockRejectedValueOnce(mockError);

    const { getByText } = render(
      <MemoryRouter>
        <AppBar username="testUser" setUsername={mockSetUsername} />
      </MemoryRouter>
    );

    const signOutButton = getByText('Kirjaudu ulos');
    fireEvent.press(signOutButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(console.error).toHaveBeenCalledWith('Error signing out:', mockError);
  });

  it('renders the "Kirjaudu sisään" tab when username is null', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AppBar username={null} setUsername={mockSetUsername} />
      </MemoryRouter>
    );

    const signInTab = getByText('Kirjaudu sisään');
    expect(signInTab).toBeTruthy();
  });
});