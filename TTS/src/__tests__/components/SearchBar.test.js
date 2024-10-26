import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '@components/SearchBar';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'searchbar.placeholder': 'Etsi hakusanalla...'
      };
      return translations[key] || key;
    },
  }),
}));

describe('SearchBar Component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<SearchBar setFilter={() => {}} />);
    
    const input = getByPlaceholderText('Etsi hakusanalla...');
    expect(input).toBeTruthy();
  });

  it('calls setFilter with the correct input value', () => {
    const mockSetFilter = jest.fn();  
    const { getByPlaceholderText } = render(<SearchBar setFilter={mockSetFilter} />);
    
    const input = getByPlaceholderText('Etsi hakusanalla...');
    
    fireEvent.changeText(input, 'test search');
    
    expect(mockSetFilter).toHaveBeenCalledWith('test search');
  });
});
