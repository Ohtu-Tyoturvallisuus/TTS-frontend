import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SuccessAlert from '@components/SuccessAlert';

describe('SuccessAlert Component', () => {
  jest.useFakeTimers();

  const mockOnDismiss = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with the given message', () => {
    const { getByText } = render(<SuccessAlert message="Success!" onDismiss={mockOnDismiss} />);

    expect(getByText('Success!')).toBeTruthy();
  });

  it('calls onDismiss after 3 seconds', async () => {
    render(<SuccessAlert message="Success!" onDismiss={mockOnDismiss} />);

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call onDismiss when it is not provided', async () => {
    render(<SuccessAlert message="Success!" />);

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });

  it('clears timer on unmount', () => {
    const { unmount } = render(<SuccessAlert message="Success!" onDismiss={mockOnDismiss} />);

    unmount();

    jest.advanceTimersByTime(3000);

    expect(mockOnDismiss).not.toHaveBeenCalled();
  });
});
