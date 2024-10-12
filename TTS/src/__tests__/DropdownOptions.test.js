import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DropdownOptions from '../components/DropdownOptions';

test('DropdownOptions renders correctly with placeholder text', () => {
  const mockOnSelect = jest.fn();
  
  const { getByText } = render(
    <DropdownOptions options={['Option 1', 'Option 2']} onSelect={mockOnSelect} />
  );

  expect(getByText('Valitse')).toBeTruthy();
  
  fireEvent.press(getByText('Valitse'));

  mockOnSelect('Option 1');

  expect(mockOnSelect).toHaveBeenCalledWith('Option 1');
});
