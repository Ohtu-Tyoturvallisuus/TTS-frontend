import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CloseButton from '@components/buttons/CloseButton';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'closebutton.close': 'Sulje',
      };
      return translations[key] || key;
    },
  }),
}));

describe('CloseButton Component', () => {
  it('renders the correct text from translation', () => {
    const { getByText } = render(<CloseButton onPress={() => {}} />);

    expect(getByText('Sulje')).toBeTruthy();
  });

  it('calls onPress when the button is pressed', () => {
    const mockOnPress = jest.fn();

    const { getByText } = render(<CloseButton onPress={mockOnPress} />);
    const button = getByText('Sulje');

    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
