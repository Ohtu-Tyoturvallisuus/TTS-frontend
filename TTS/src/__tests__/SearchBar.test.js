import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../components/SearchBar';  

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
