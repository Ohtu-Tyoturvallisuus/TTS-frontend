import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DropdownOptions from '@components/DropdownOptions';

jest.mock('react-native-select-dropdown', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const { useState } = require('react');
  const MockSelectDropdown = ({
    data,
    onSelect,
    renderButton,
    renderItem,
  }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelect = (item) => {
      setSelectedItem(item);
      onSelect(item);
    };

    const handleClear = () => {
      setSelectedItem(null);
      onSelect(null);
    };

    return (
      <View>
        <TouchableOpacity onPress={handleClear}>
          {renderButton(selectedItem)}
        </TouchableOpacity>
        {data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleSelect(item)}>
            {renderItem ? renderItem(item) : <Text>{item}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  MockSelectDropdown.displayName = 'MockSelectDropdown';
  return MockSelectDropdown;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'dropdownoptions.search': 'Search...',
      };
      return translations[key] || key;
    },
  }),
}));

describe('DropdownOptions Component', () => {
  const options = [
    'Option 1',
    'Option 2'
  ];
  const placeholderText = 'Select an option';

  it('renders correctly with string options', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions
        options={options}
        onSelect={mockOnSelect}
        placeholderText={placeholderText}
      />
    );

    // Check if placeholder text is rendered
    expect(getByText(placeholderText)).toBeTruthy();

    // Check if options are rendered
    options.forEach(option => {
      expect(getByText(option)).toBeTruthy();
    });

    // Simulate selecting an option
    fireEvent.press(getByText('Option 1'));
    expect(mockOnSelect).toHaveBeenCalledWith('Option 1');
  });
});
