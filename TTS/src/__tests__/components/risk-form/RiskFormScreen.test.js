import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RiskFormScreen from '@components/risk-form/RiskFormScreen';
import { FormProvider } from '@contexts/FormContext';
import { TranslationProvider } from '@contexts/TranslationContext';
import { NavigationProvider, NavigationContext } from '@contexts/NavigationContext';

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, ) => key,
    i18n: {
      language: 'fi',
    },
  }),
}));

jest.mock('@contexts/TranslationContext', () => {
  const originalModule = jest.requireActual('@contexts/TranslationContext');
  return {
    ...originalModule,
    useTranslationLanguages: jest.fn(() => ({
      fromLang: 'fi',
      toLangs: ['en', 'sv'],
    })),
  };
});

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('@components/risk-form/RiskForm', () => {
  const { Text } = require('react-native');
  const MockedRiskForm = () => <Text>Mocked Risk Form</Text>;
  MockedRiskForm.displayName = 'MockedRiskForm';
  return MockedRiskForm;
});

describe('RiskFormScreen', () => {
  const mockSetCurrentLocation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = () => {
    return render(
      <NavigationProvider>
        <FormProvider>
          <TranslationProvider>
            <NavigationContext.Provider value={{ setCurrentLocation: mockSetCurrentLocation }}>
              <RiskFormScreen />
            </NavigationContext.Provider>
          </TranslationProvider>
        </FormProvider>
      </NavigationProvider>
    );
  };

  it('sets currentLocation to "RiskForm" on mount', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(mockSetCurrentLocation).toHaveBeenCalledWith('RiskForm');
    });
  });

  it('renders the RiskForm component', () => {
    const { getByText } = renderWithProviders();

    expect(getByText('Mocked Risk Form')).toBeTruthy();
  });
});
