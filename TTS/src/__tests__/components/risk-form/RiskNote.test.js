import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskNote from '@components/risk-form/RiskNote';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'risknote.checked': 'Kunnossa',
        'risknote.notRelevant': 'Ei koske',
        'risknote.toBeNoted': 'Huomioitavaa',
        'riskmodal.extraInfo': 'Syötä lisätietoja',
        'riskmodal.withSpeech': 'Syötä puheella',
        'riskmodal.cancel': 'Peruuta',
        'riskmodal.reset': 'Resetoi',
        'riskmodal.checked': 'Kunnossa'
      };
      return translations[key] || key;
    },
  }),
}));

describe('RiskNote Component', () => {
  const mockOnChange = jest.fn();

  afterEach(() => {
    mockOnChange.mockClear();
  });

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

  it('should submit new description and status as "Kunnossa"', () => {
    const { getByText, getByPlaceholderText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    fireEvent.press(getByText('Huomioitavaa'));
    const descriptionInput = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(descriptionInput, 'Lisätietoja');
    fireEvent.press(getByText('Kunnossa'));

    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'description', 'Lisätietoja');
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', 'Kunnossa');
  });

  it('displays "Ei koske" message when "Ei koske" is pressed', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    fireEvent.press(getByText('Ei koske'));
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', 'Ei koske');
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('should open the modal in edit mode and reset risk', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('✏️'));
    expect(getByText('Syötä puheella')).toBeTruthy();
    expect(getByText('Peruuta')).toBeTruthy();
    expect(getByText('Resetoi')).toBeTruthy();
    expect(getByText('Kunnossa')).toBeTruthy();
    fireEvent.press(getByText('Resetoi'));
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'description', '');
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', '');
  });

  it('should close modal when cancel is pressed', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('✏️'));
    fireEvent.press(getByText('Peruuta'));
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
