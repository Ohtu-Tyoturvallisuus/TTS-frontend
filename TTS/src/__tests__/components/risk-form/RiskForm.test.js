import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import { FormProvider } from '@contexts/FormContext';
import RiskForm from '@components/risk-form/RiskForm';
import { submitForm } from '@services/formSubmission';

jest.mock('@hooks/useFetchSurveyData', () => jest.fn(() => ({
  surveyData: {
    
  },
  loading: false,
  error: null,
})));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {};
      return translations[key] || key;
    },
    i18n: {
      language: 'en-GB',
    },
  }),
}));

jest.mock('@services/formSubmission', () => ({
  submitForm: jest.fn(),
}));

describe('RiskForm Component', () => {
  const project = {
    id: 1,
    project_name: 'Test Project',
    project_id: '1234',
  };

  const setup = () => {
    const contextValue = {
      selectedProject: project,
      selectedSurveyURL: 'http://example.com/survey',
      resetProjectAndSurvey: jest.fn(),
    };

    return render(
      <NavigationContainer>
        <ProjectSurveyContext.Provider value={contextValue}>
          <FormProvider>
            <RiskForm />
          </FormProvider>
        </ProjectSurveyContext.Provider>
      </NavigationContainer>
    );
  };

  it('renders correctly with project details', () => {
    const { getByText } = setup();

    expect(getByText('Test Project')).toBeTruthy();
    expect(getByText('Project ID:')).toBeTruthy();
    expect(getByText('1234')).toBeTruthy();
  });

  it('submits the form with correct data', async () => {
    const { getByText } = setup();

    // Simulate user interactions
    fireEvent.changeText(getByText('Task:'), 'installation');
    fireEvent.changeText(getByText('Task description:'), 'This is a test task description.');

    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(submitForm).toHaveBeenCalledWith(
        project,
        expect.objectContaining({
          task: 'installation',
          description: 'This is a test task description.',
          scaffold_type: '',
        }),
        {},
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  it('shows success alert after successful submission', async () => {
    submitForm.mockImplementationOnce((project, taskInfo, formData, setShowSuccessAlert) => {
      setShowSuccessAlert(true);
    });

    const { getByText } = setup();

    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(getByText('Success!')).toBeTruthy(); // Adjust this line to match the success message text
    });
  });

  it('handles adding new risk notes', () => {
    const { getByText } = setup();

    fireEvent.press(getByText('+ Other Scaffolding'));

    // Ensure the new risk note is added. 
    expect(getByText('New Risk Note Title')).toBeTruthy(); // Replace with the expected title
  });

  it('shows exit modal when close button is pressed', () => {
    const { getByText } = setup();

    fireEvent.press(getByText('Close'));

    expect(getByText('Are you sure you want to exit?')).toBeTruthy(); // Adjust this to match your exit confirmation text
  });
});
