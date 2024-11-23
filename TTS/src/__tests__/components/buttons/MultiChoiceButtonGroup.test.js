import React, { useState } from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import MultiChoiceButtonGroup from '@components/buttons/MultiChoiceButtonGroup';

describe('MultiChoiceButtonGroup Component', () => {
  it('renders correctly with no options provided (default [])', () => {
    const { queryByText } = render(<MultiChoiceButtonGroup onChange={() => {}} />);

    expect(queryByText('Option 1')).toBeNull();
    expect(queryByText('Option 2')).toBeNull();
    expect(queryByText('Option 3')).toBeNull();
  });

  it('renders all buttons with correct labels', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const { getByText } = render(
      <MultiChoiceButtonGroup options={options} selectedValues={[]} onChange={() => {}} />
    );

    options.forEach(option => {
      expect(getByText(option)).toBeTruthy();
    });
  });

  it('toggles selection state when a button is pressed', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const mockOnChange = jest.fn();

    const MultiChoiceWrapper = () => {
      const [selectedValues, setSelectedValues] = useState([]);
      return (
        <MultiChoiceButtonGroup
          options={options}
          selectedValues={selectedValues}
          onChange={(newSelection) => {
            setSelectedValues(newSelection);
            mockOnChange(newSelection);
          }}
        />
      );
    };

    const { getByText, getByTestId } = render(<MultiChoiceWrapper />);

    const option1Button = getByText('Option 1');
    const option2Button = getByText('Option 2');

    // Initially unselected
    expect(getByTestId('button-Option 1')).toHaveStyle({ backgroundColor: '#6f7072' });
    expect(getByTestId('button-Option 2')).toHaveStyle({ backgroundColor: '#6f7072' });

    // Select Option 1
    fireEvent.press(option1Button);
    expect(mockOnChange).toHaveBeenCalledWith(['Option 1']);
    expect(getByTestId('button-Option 1')).toHaveStyle({ backgroundColor: '#FF8C00' });

    // Select Option 2
    fireEvent.press(option2Button);
    expect(mockOnChange).toHaveBeenCalledWith(['Option 1', 'Option 2']);
    expect(getByTestId('button-Option 2')).toHaveStyle({ backgroundColor: '#FF8C00' });

    // Deselect Option 1
    fireEvent.press(option1Button);
    expect(mockOnChange).toHaveBeenCalledWith(['Option 2']);
    expect(getByTestId('button-Option 1')).toHaveStyle({ backgroundColor: '#6f7072' });
  });

  it('renders buttons using the renderOption function when provided', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    const customRenderOption = (option) => {
      return <Text>{`Custom: ${option}`}</Text>;
    };

    const { getByText } = render(
      <MultiChoiceButtonGroup
        options={options}
        selectedValues={[]}
        onChange={() => {}}
        renderOption={customRenderOption}
      />
    );

    options.forEach(option => {
      expect(getByText(`Custom: ${option}`)).toBeTruthy();
    });
  });

  it('applies correct styles for selected and unselected buttons', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    const MultiChoiceWrapper = () => {
      const [selectedValues, setSelectedValues] = useState(['Option 1']);
      return (
        <MultiChoiceButtonGroup
          options={options}
          selectedValues={selectedValues}
          onChange={setSelectedValues}
        />
      );
    };

    const { getByTestId } = render(<MultiChoiceWrapper />);

    expect(getByTestId('button-Option 1')).toHaveStyle({ backgroundColor: '#FF8C00' });
    expect(getByTestId('button-Option 2')).toHaveStyle({ backgroundColor: '#6f7072' });
    expect(getByTestId('button-Option 3')).toHaveStyle({ backgroundColor: '#6f7072' });
  });
});
