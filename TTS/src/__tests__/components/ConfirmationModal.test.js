import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConfirmationModal from '@components/ConfirmationModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'confirmation.confirmLeave': 'Are you sure you want to leave?',
        'confirmation.changesWillBeLost': 'Any unsaved changes will be lost.',
        'confirmation.cancel': 'Cancel',
        'confirmation.confirm': 'Confirm',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ConfirmationModal Component', () => {
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <ConfirmationModal visible={true} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />
    );

    expect(getByText('Are you sure you want to leave?')).toBeTruthy();
    expect(getByText('Any unsaved changes will be lost.')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Confirm')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <ConfirmationModal visible={false} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />
    );

    expect(queryByText('Are you sure you want to leave?')).toBeNull();
    expect(queryByText('Any unsaved changes will be lost.')).toBeNull();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByText } = render(
      <ConfirmationModal visible={true} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const { getByText } = render(
      <ConfirmationModal visible={true} onCancel={mockOnCancel} onConfirm={mockOnConfirm} />
    );

    fireEvent.press(getByText('Confirm'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  }); 
});
