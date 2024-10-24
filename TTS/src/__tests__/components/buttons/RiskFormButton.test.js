import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskFormButton from '@components/buttons/RiskFormButton';
import { useNavigate } from 'react-router-native';

jest.mock('react-router-native', () => ({
  useNavigate: jest.fn(),
}));

describe('RiskFormButton Component', () => {
  it('renders with the provided title', () => {
    const title = 'Täytä uusi riskilomake';
    const { getByText } = render(<RiskFormButton title={title} />);

    expect(getByText(title)).toBeTruthy();
  });

  it('navigates to the correct route when the button is pressed', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const title = 'Täytä uusi riskilomake';
    const { getByText } = render(<RiskFormButton title={title} />);

    fireEvent.press(getByText('Täytä uusi riskilomake'));

    expect(mockNavigate).toHaveBeenCalledWith('riskform');
  });
});
