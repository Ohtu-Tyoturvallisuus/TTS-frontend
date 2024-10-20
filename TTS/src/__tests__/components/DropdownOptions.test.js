import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DropdownOptions from '@components/DropdownOptions';

jest.mock('react-native-select-dropdown', () => {
  const { View, Text, TouchableOpacity } = require('react-native');  
  const MockSelectDropdown = ({
    data,
    onSelect,
    defaultButtonText,
    renderButton,
    renderItem,
    buttonTextAfterSelection,
    renderSearchInputLeftIcon
  }) => (
    <View>
      {renderButton ? renderButton(null) : (
        <TouchableOpacity onPress={() => onSelect(data[0])}>
          <Text>{defaultButtonText}</Text>
        </TouchableOpacity>
      )}
      {renderSearchInputLeftIcon ? renderSearchInputLeftIcon() : <Text>🔍</Text>}
      {data.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onSelect(item)}>
          {renderItem ? renderItem(item) : <Text>{buttonTextAfterSelection ? buttonTextAfterSelection(item) : item}</Text>}
        </TouchableOpacity>
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
        'dropdownoptions.chooseAll': '--Choose all--',
        'dropdownoptions.search': 'Search...',
      };
      return translations[key] || key;
    },
  }),
}));

describe('DropdownOptions Component', () => {
  const options = [
    ['--Choose all--', ''],
    ['Option 1', 'Description 1'],
    ['Option 2', 'Description 2']
  ];
  const placeholderText = 'Select an option';

  it('renders correctly with options and descriptions', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions options={options} onSelect={mockOnSelect} placeholderText={placeholderText} />
    );

    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));

    expect(getByText('--Choose all--, ')).toBeTruthy();
    expect(getByText('Option 1, Description 1')).toBeTruthy();
    expect(getByText('Option 2, Description 2')).toBeTruthy();
  });

  it('calls onSelect with null when "Choose All" is selected', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions options={options} onSelect={mockOnSelect} placeholderText={placeholderText} />
    );

    expect(getByText(placeholderText)).toBeTruthy();
    fireEvent.press(getByText(placeholderText));
    fireEvent.press(getByText('--Choose all--, '));

    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  it('calls onSelect when an option is selected and renders the button with selected item text', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <DropdownOptions options={options} onSelect={mockOnSelect} placeholderText={placeholderText} />
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
});