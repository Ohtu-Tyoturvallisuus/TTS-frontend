import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskFormButton from '../../../components/risk_form/RiskFormButton';
import { useNavigate } from 'react-router-native';

jest.mock('react-router-native', () => ({
  useNavigate: jest.fn(),
}));

describe('RiskFormButton Component', () => {
  it('renders with default title', () => {
    const { getByText } = render(<RiskFormButton />);

    expect(getByText('Täytä uusi riskilomake')).toBeTruthy();
  });

  it('renders with a custom title', () => {
    const customTitle = 'Submit Risk Form';
    const { getByText } = render(<RiskFormButton title={customTitle} />);

    expect(getByText(customTitle)).toBeTruthy();
  });

  it('navigates to the correct route when the button is pressed', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const { getByText } = render(<RiskFormButton />);

    fireEvent.press(getByText('Täytä uusi riskilomake'));

    expect(mockNavigate).toHaveBeenCalledWith('worksafetyform');
  });
});
