import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DropdownOptions from '@components/DropdownOptions';

jest.mock('react-native-select-dropdown', () => {
  const { View, Text } = require('react-native');  
  const MockSelectDropdown = ({ data, onSelect, buttonTextAfterSelection, defaultButtonText }) => (
    <View>
      <Text onPress={() => onSelect(data[0])}>{defaultButtonText}</Text>
      {data.map((item, index) => (
        <Text key={index} onPress={() => onSelect(item)}>
          {buttonTextAfterSelection ? buttonTextAfterSelection(item) : item}
        </Text>
      ))}
    </View>
  );

  MockSelectDropdown.displayName = 'MockSelectDropdown';
  return MockSelectDropdown;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'dropdownoptions.chooseAll': '--Valitse kaikki--',
        'dropdownoptions.search': 'Etsi...',
      };
      return translations[key] || key;
    },
  }),
}));

describe('DropdownOptions Component', () => {
  it('renders correctly with options', () => {
    const mockOnSelect = jest.fn();
    const placeholder = 'Valitse alue';
    
    const { getByText } = render(
      <DropdownOptions options={['Option 1', 'Option 2']} onSelect={mockOnSelect} placeholderText={placeholder} />
    );

    expect(getByText('Valitse alue')).toBeTruthy();
    fireEvent.press(getByText('Valitse alue'));
    
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('calls onSelect when an option is selected', () => {
    const mockOnSelect = jest.fn();
    const placeholder = 'Valitse alue';
    
    const { getByText } = render(
      <DropdownOptions options={['Option 1', 'Option 2']} onSelect={mockOnSelect} placeholderText={placeholder} />
    );
    
    expect(getByText('Valitse alue')).toBeTruthy();
    fireEvent.press(getByText('Option 1'));

    expect(mockOnSelect).toHaveBeenCalledWith('Option 1');
  });
});