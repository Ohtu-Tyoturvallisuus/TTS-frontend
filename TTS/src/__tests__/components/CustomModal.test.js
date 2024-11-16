import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomModal from '@components/CustomModal';
import { Text } from 'react-native';

describe('CustomModal Component', () => {
  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <CustomModal visible={true} onClose={mockOnClose}>
        <Text>Test Modal Content</Text>
      </CustomModal>
    );

    expect(getByText('Test Modal Content')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <CustomModal visible={false} onClose={mockOnClose}>
        <Text>Test Modal Content</Text>
      </CustomModal>
    );

    expect(queryByText('Test Modal Content')).toBeNull();
  });

  it('does not call onClose when modal content is pressed', () => {
    const { getByText } = render(
      <CustomModal visible={true} onClose={mockOnClose}>
        <Text>Test Modal Content</Text>
      </CustomModal>
    );

    fireEvent.press(getByText('Test Modal Content'));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the back button is pressed on Android', () => {
    const { getByText } = render(
      <CustomModal visible={true} onClose={mockOnClose}>
        <Text>Test Modal Content</Text>
      </CustomModal>
    );

    fireEvent(getByText('Test Modal Content').parent.parent, 'onRequestClose');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
