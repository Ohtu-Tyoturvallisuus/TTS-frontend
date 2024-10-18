import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UserContext, UserProvider } from '@contexts/UserContext';
import { Text, Button } from 'react-native';

const TestComponent = () => {
  const { username, setUsername } = useContext(UserContext);
  return (
    <>
      <Text testID="username">{username ? username : 'No user'}</Text>
      <Button title="Set Username" onPress={() => setUsername('NewUser')} />
    </>
  );
};

describe('UserProvider', () => {
  it('should provide default value for username and allow updating username', () => {
    const { getByTestId, getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(getByTestId('username').props.children).toBe('No user');

    fireEvent.press(getByText('Set Username'));

    expect(getByTestId('username').props.children).toBe('NewUser');
  });
});
