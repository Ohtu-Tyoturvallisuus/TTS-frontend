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
        'riskmodal.reset': 'Tyhjennä',
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

  const renderTitle = (key) => {
    return `Translated: ${key}`; // Mocking the renderTitle function
  };

  it('displays the risk note and buttons', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} renderTitle={renderTitle} />);
    
    expect(getByText('Translated: Test Risk Note')).toBeTruthy();
    expect(getByText('Huomioitavaa')).toBeTruthy();
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('renders the title when renderTitle is not provided', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} />);
    
    expect(getByText('Test Risk Note')).toBeTruthy();
  });

  it('should submit new description and status as "Kunnossa"', () => {
    const { getByText, getByPlaceholderText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} renderTitle={renderTitle} />);
    
    fireEvent.press(getByText('Huomioitavaa'));
    const descriptionInput = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(descriptionInput, 'Lisätietoja');
    fireEvent.press(getByText('Kunnossa'));

    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'description', 'Lisätietoja');
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', 'checked');
  });

  it('displays "Ei koske" message when "Ei koske" is pressed', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} renderTitle={renderTitle} />);
    
    fireEvent.press(getByText('Ei koske'));
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', 'notRelevant');
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('should open the modal in edit mode and reset risk', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} renderTitle={renderTitle} />);
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('✏️'));
    expect(getByText('Syötä puheella')).toBeTruthy();
    expect(getByText('Peruuta')).toBeTruthy();
    expect(getByText('Tyhjennä')).toBeTruthy();
    expect(getByText('Kunnossa')).toBeTruthy();
    fireEvent.press(getByText('Tyhjennä'));
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'description', '');
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', '');
  });

  it('should close modal when cancel is pressed', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} renderTitle={renderTitle} />);
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('✏️'));
    fireEvent.press(getByText('Peruuta'));
    expect(mockOnChange).toHaveBeenCalledWith('Test Risk Note', 'status', 'notRelevant');
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('can edit after submitting', () => {
    const { getByText } = render(<RiskNote {...mockRisk} onChange={mockOnChange} renderTitle={renderTitle} />);
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('✏️')); 
    expect(getByText('Syötä puheella')).toBeTruthy();
    expect(getByText('Peruuta')).toBeTruthy();
    expect(getByText('Tyhjennä')).toBeTruthy();
    expect(getByText('Kunnossa')).toBeTruthy();
  });
});
