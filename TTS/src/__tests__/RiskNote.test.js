import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskNote from '../components/risk_form/RiskNote';

describe('<RiskNote />', () => {
  const mockOnChange = jest.fn();

  const mockRisk = {
    title: 'Test Risk Note',
    initialStatus: '',
    initialDescription: ''
  };

  it('displays the risk note and buttons', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    expect(getByText('Test Risk Note')).toBeTruthy();
    expect(getByText('Huomioitavaa')).toBeTruthy();
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('displays "Ei koske" message when "Ei koske" is pressed', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    fireEvent.press(getByText('Ei koske'));
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', 'Ei koske');
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('can edit after submitting', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('✏️')); 
    expect(getByText('Syötä puheella')).toBeTruthy();
    expect(getByText('Peruuta')).toBeTruthy();
    expect(getByText('Resetoi')).toBeTruthy();
    expect(getByText('Kunnossa')).toBeTruthy();
  });
});
