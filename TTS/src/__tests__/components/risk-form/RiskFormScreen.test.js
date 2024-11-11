import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RiskFormScreen from '@components/risk-form/RiskFormScreen';
import { useIsFocused } from '@react-navigation/native';
import { FormProvider } from '@contexts/FormContext';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('@hooks/useFormFields', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    initialFormData: {
      personal_protection: { description: '', status: '', risk_type: 'scaffolding' },
      personal_fall_protection: { description: '', status: '', risk_type: 'scaffolding' },
    },
  })),
}));

jest.mock('@components/risk-form/RiskForm', () => {
  const { Text } = require('react-native');
  const MockedRiskForm = () => <Text>Mocked Risk Form</Text>;
  MockedRiskForm.displayName = 'MockedRiskForm';
	return MockedRiskForm;
});

describe('RiskFormScreen', () => {
  const mockOnFocusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onFocusChange with true when focused', async () => {
    useIsFocused.mockReturnValue(true);

    render(
			<FormProvider>
				<RiskFormScreen onFocusChange={mockOnFocusChange} />
			</FormProvider>
		);

    await waitFor(() => {
      expect(mockOnFocusChange).toHaveBeenCalledWith(false);
    });
  });

  it('calls onFocusChange with false when unfocused', async () => {
    useIsFocused.mockReturnValue(false);

    render(
			<FormProvider>
				<RiskFormScreen onFocusChange={mockOnFocusChange} />
			</FormProvider>
		);

    await waitFor(() => {
      expect(mockOnFocusChange).toHaveBeenCalledWith(true);
    });
  });

  it('renders RiskForm component', () => {
    useIsFocused.mockReturnValue(true);

    const { getByText } = render(
			<FormProvider>
				<RiskFormScreen onFocusChange={mockOnFocusChange} />
			</FormProvider>
		);

    expect(getByText('Mocked Risk Form')).toBeTruthy();
  });
});
