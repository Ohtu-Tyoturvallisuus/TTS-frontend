import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsButton from '@components/buttons/SettingsButton';

describe('SettingsButton Component', () => {
  const mockOnPress = jest.fn();
  const buttonText = 'Change Settings';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with the provided text', () => {
    const { getByText } = render(
      <SettingsButton onPress={mockOnPress} text={buttonText} />
    );
    expect(getByText(buttonText)).toBeTruthy();
  });

  it('calls the onPress function when pressed', () => {
    const { getByText } = render(
      <SettingsButton onPress={mockOnPress} text={buttonText} />
    );
    fireEvent.press(getByText(buttonText));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});