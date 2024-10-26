import React, { useState } from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonGroup from '@components/buttons/ButtonGroup';

describe('ButtonGroup Component', () => {

  it('renders correctly with no options provided (default [])', () => {
    const { queryByText } = render(<ButtonGroup onChange={() => {}} />);

    expect(queryByText('Option 1')).toBeNull();
    expect(queryByText('Option 2')).toBeNull();
    expect(queryByText('Option 3')).toBeNull();
  });

  it('renders all buttons with correct labels', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const { getByText } = render(<ButtonGroup options={options} onChange={() => {}} />);
    
    options.forEach(option => {
      expect(getByText(option)).toBeTruthy();
    });
  });

  it('calls onChange with the correct value when a button is pressed', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const mockOnChange = jest.fn();
    const { getByText } = render(<ButtonGroup options={options} onChange={mockOnChange} />);
    
    const button = getByText('Option 1');
    
    fireEvent.press(button);
    expect(mockOnChange).toHaveBeenCalledWith('Option 1');
  });

  it('renders buttons using the renderOption function when provided', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    const customRenderOption = (option) => {
      return <Text>{`Custom: ${option}`}</Text>;
    };

    const { getByText } = render(
      <ButtonGroup 
        options={options} 
        onChange={() => {}} 
        renderOption={customRenderOption} 
      />
    );

    options.forEach(option => {
      expect(getByText(`Custom: ${option}`)).toBeTruthy();
    });
  });

  it('should apply blue background to the selected option and gray to others', () => {
    const mockOnChange = jest.fn();
    const options = ['Option 1', 'Option 2', 'Option 3'];

    const ButtonGroupWrapper = () => {
      const [selectedValue, setSelectedValue] = useState('Option 1');
      return (
        <ButtonGroup
          options={options}
          selectedValue={selectedValue}
          onChange={(value) => {
            setSelectedValue(value);
            mockOnChange(value);
          }}
        />
      );
    };

    const { getByText, getByTestId } = render(<ButtonGroupWrapper />);

    expect(getByTestId('button-Option 1')).toHaveStyle({ backgroundColor: '#FF8C00' });
    expect(getByTestId('button-Option 2')).toHaveStyle({ backgroundColor: '#6f7072' });
    expect(getByTestId('button-Option 3')).toHaveStyle({ backgroundColor: '#6f7072' });

    fireEvent.press(getByText('Option 2'));
    expect(mockOnChange).toHaveBeenCalledWith('Option 2');

    expect(getByTestId('button-Option 1')).toHaveStyle({ backgroundColor: '#6f7072' });
    expect(getByTestId('button-Option 2')).toHaveStyle({ backgroundColor: '#FF8C00' });
    expect(getByTestId('button-Option 3')).toHaveStyle({ backgroundColor: '#6f7072' });
  });
});

