import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskModal from '@components/risk-form/RiskModal'; 

describe('<RiskModal />', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();
  const mockTitle = "Test Modal Title";

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
  });

  it('renders modal with title and closes when "Peruuta" is pressed', () => {
    const { getByText } = render(
      <RiskModal
        title={mockTitle}
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    expect(getByText(mockTitle)).toBeTruthy();
    expect(getByText('Peruuta')).toBeTruthy();

    fireEvent.press(getByText('Peruuta'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with description when "Kunnossa" is pressed', () => {
    const { getByText, getByPlaceholderText } = render(
      <RiskModal
        title={mockTitle}
        visible={true}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    );

    const input = getByPlaceholderText('Syötä lisätietoja');

    fireEvent.changeText(input, 'This is a test description');

    fireEvent.press(getByText('Kunnossa'));

    expect(mockOnSubmit).toHaveBeenCalledWith('This is a test description');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
