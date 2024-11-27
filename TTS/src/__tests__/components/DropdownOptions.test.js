import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DropdownOptions from '@components/DropdownOptions';

jest.mock('react-native-select-dropdown', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const { useState } = require('react');
  const MockSelectDropdown = ({
    data,
    onSelect,
    defaultButtonText,
    renderButton,
    renderItem,
    buttonTextAfterSelection,
    renderSearchInputLeftIcon,
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
        {renderButton ? (
          renderButton(selectedItem)
        ) : (
          <View>
            <Text>
              {selectedItem
                ? buttonTextAfterSelection(selectedItem)
                : defaultButtonText}
            </Text>
            {selectedItem && (
              <TouchableOpacity onPress={handleClear} accessible>
                <Text>×</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {renderSearchInputLeftIcon ? renderSearchInputLeftIcon() : <Text>🔍</Text>}
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
    ['Option 1', 'Description 1'],
    ['Option 2', 'Description 2']
  ];
  const placeholderText = 'Select an option';
  const mockButtonTextAfterSelection = (item) => `${item[0]}, ${item[1]}`;

  it('renders correctly with options and descriptions', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions 
        options={options}
        onSelect={mockOnSelect}
        placeholderText={placeholderText}
        buttonTextAfterSelection={mockButtonTextAfterSelection}
      />
    );

    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));

    expect(getByText('Option 1, Description 1')).toBeTruthy();
    expect(getByText('Option 2, Description 2')).toBeTruthy();
  });

  it('calls onSelect when an option is selected and renders the button with selected item text', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions 
        options={options}
        onSelect={mockOnSelect}
        placeholderText={placeholderText}
        buttonTextAfterSelection={mockButtonTextAfterSelection}
      />
    );
    
    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));
    fireEvent.press(getByText('Option 1, Description 1'));

    expect(mockOnSelect).toHaveBeenCalledWith(['Option 1', 'Description 1']);
    expect(getByText('Option 1, Description 1')).toBeTruthy();
  });

  it('renders the search input left icon correctly', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions
        options={options}
        onSelect={mockOnSelect}
        placeholderText={placeholderText}
        renderSearchInputLeftIcon={() => <Text style={{ color: '#000000', fontSize: 18 }}>🔍</Text>}
      />
    );

    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));
    expect(getByText('🔍')).toBeTruthy();
  });

  it('renders correctly with an empty options list', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions options={[]} onSelect={mockOnSelect} placeholderText={placeholderText} />
    );

    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));

    expect(() => getByText('Option 1, Description 1')).toThrow();
    expect(() => getByText('Option 2, Description 2')).toThrow();
  });

  it('renders correctly when options prop is not provided', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions onSelect={mockOnSelect} placeholderText={placeholderText} />
    );

    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));

    expect(() => getByText('Option 1, Description 1')).toThrow();
    expect(() => getByText('Option 2, Description 2')).toThrow();
  });

  it('handles malformed options gracefully', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
        <DropdownOptions options={[null, undefined, ['Invalid Option']]} onSelect={mockOnSelect} placeholderText={placeholderText} />
    );

    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));

    expect(() => getByText('Invalid Option')).toThrow();
  });

  it('does not render the clear button when no item is selected', () => {
    const mockOnSelect = jest.fn();
    const { getByText, queryByText } = render(
      <DropdownOptions 
        options={options}
        onSelect={mockOnSelect}
        placeholderText={placeholderText}
        buttonTextAfterSelection={mockButtonTextAfterSelection}
      />
    );

    expect(getByText(placeholderText)).toBeTruthy();

    expect(queryByText('×')).toBeNull();
  });
});