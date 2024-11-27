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
    const { getByPlaceholderText } = render(<SearchBar />);

    const input = getByPlaceholderText('Etsi hakusanalla... (kaikki alueet)');
    expect(input).toBeTruthy();
  });

  it('calls onChange with the correct input value', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar onChange={mockOnChange} />);

    const input = getByPlaceholderText('Etsi hakusanalla... (kaikki alueet)');

    fireEvent.changeText(input, 'test search');

    expect(mockOnChange).toHaveBeenCalledWith('test search');
  });

  it('shows correct placeholder text with given area', () => {
    const { getByPlaceholderText } = render(<SearchBar area="Test area" />);
    const input = getByPlaceholderText('Etsi hakusanalla... (Test area)');

    expect(input).toBeTruthy();
  });
});
