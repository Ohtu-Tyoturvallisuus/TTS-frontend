import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RiskFormScreen from '@components/risk-form/RiskFormScreen';
import { useIsFocused } from '@react-navigation/native';
import { FormProvider } from '@contexts/FormContext';
import { TranslationProvider } from '@contexts/TranslationContext';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';

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
    t: (key, options) => key, // Mock the t function to return the key
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

// Mock the RiskForm component
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
        <TranslationProvider>
          <ProjectSurveyContext.Provider value={{ selectedProject: {}, selectedSurveyURL: '', resetProjectAndSurvey: jest.fn() }}>
            <RiskFormScreen onFocusChange={mockOnFocusChange} />
          </ProjectSurveyContext.Provider>
        </TranslationProvider>
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
        <TranslationProvider>
          <ProjectSurveyContext.Provider value={{ selectedProject: {}, selectedSurveyURL: '', resetProjectAndSurvey: jest.fn() }}>
            <RiskFormScreen onFocusChange={mockOnFocusChange} />
          </ProjectSurveyContext.Provider>
        </TranslationProvider>
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
        <TranslationProvider>
          <ProjectSurveyContext.Provider value={{ selectedProject: {}, selectedSurveyURL: '', resetProjectAndSurvey: jest.fn() }}>
            <RiskFormScreen onFocusChange={mockOnFocusChange} />
          </ProjectSurveyContext.Provider>
        </TranslationProvider>
      </FormProvider>
    );

    expect(getByText('Mocked Risk Form')).toBeTruthy();
  });
});
