import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskNote from '../components/risk_form/RiskNote'; 

describe('<RiskNote />', () => {
  const mockRisk = { note: 'Test Risk Note' };

  it('displays the risk note and buttons', () => {
    const { getByText } = render(<RiskNote risk={mockRisk} />);
    
    expect(getByText('Test Risk Note')).toBeTruthy();
    expect(getByText('Huomioitavaa')).toBeTruthy();
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('displays "Ei koske" message when "Ei koske" is pressed', () => {
    const { getByText } = render(<RiskNote risk={mockRisk} />);
    
    fireEvent.press(getByText('Ei koske'));
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('can edit after submitting', () => {
    const { getByText } = render(<RiskNote risk={mockRisk} />);
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('✏️')); 
    expect(getByText('Huomioitavaa')).toBeTruthy();
  });
});
