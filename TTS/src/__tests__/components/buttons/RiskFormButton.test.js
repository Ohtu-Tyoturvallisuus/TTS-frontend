import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskFormButton from '@components/buttons/RiskFormButton';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('RiskFormButton Component', () => {
  it('renders with the provided title', () => {
    const title = 'Täytä uusi riskilomake';
    const { getByText } = render(<RiskFormButton title={title} />);

    expect(getByText(title)).toBeTruthy();
  });

  it('navigates to the correct route when the button is pressed', () => {
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });

    const title = 'Täytä uusi riskilomake';
    const { getByText } = render(<RiskFormButton title={title} />);

    fireEvent.press(getByText('Täytä uusi riskilomake'));

    expect(mockNavigate).toHaveBeenCalledWith('RiskForm');
  });
});
