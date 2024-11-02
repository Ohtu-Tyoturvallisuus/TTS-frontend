import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskFormButton from '@components/buttons/RiskFormButton';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('RiskFormButton Component', () => {
  const title = 'Täytä uusi riskilomake';
  const mockSetVisible = jest.fn();

  it('renders with the provided title', () => {    
    const { getByText } = render(<RiskFormButton title={title} setVisible={mockSetVisible} />);

    expect(getByText(title)).toBeTruthy();
  });

  it('navigates to the correct route when the button is pressed', () => {
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
    const { getByText } = render(<RiskFormButton title={title} setVisible={mockSetVisible} />);

    fireEvent.press(getByText('Täytä uusi riskilomake'));

    expect(mockNavigate).toHaveBeenCalledWith('RiskForm');
    expect(mockSetVisible).toHaveBeenCalledWith(false);
  });
});
