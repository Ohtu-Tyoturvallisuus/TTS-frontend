// TaskInfo.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TaskInfo from '@components/risk-form/TaskInfo';
import { useFormContext } from '@contexts/FormContext';
import { useTranslationLanguages } from '@contexts/TranslationContext';
import { performTranslations } from '@services/performTranslations';

jest.mock('@components/speech-to-text/TranslationsView', () => {
  return function MockTranslationsView() {
    return null; // Return null or a simple placeholder
  };
});

jest.mock('@components/speech-to-text/SpeechToTextView', () => {
  return function MockSpeechToTextView() {
    return null;
  };
});

// Mock dependencies
jest.mock('@contexts/FormContext');
jest.mock('@contexts/TranslationContext');
jest.mock('@services/performTranslations');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'fi',
      changeLanguage: jest.fn()
    }
  }),
  i18n: {
    language: 'fi',
    changeLanguage: jest.fn()
  }
}));
jest.mock('@utils/scaffoldUtils', () => ({
  useScaffoldItems: jest.fn(() => [
    { id: 'workScaffold', name: 'Working Scaffold' },
    { id: 'accessScaffold', name: 'Access Scaffold' }
  ])
}));

const mockProject = {
  project_name: 'Test Project',
  project_id: 'TEST123'
};

describe('TaskInfo Component', () => {
  const mockSetToLangs = jest.fn();
  const mockGetFormData = jest.fn();
  const mockSetTask = jest.fn();
  const mockSetScaffoldType = jest.fn();
  const mockSetTaskDesc = jest.fn();
  const mockUpdateTranslations = jest.fn();

  beforeEach(() => {
    useFormContext.mockImplementation(() => ({
      getFormData: mockGetFormData,
      task: [],
      setTask: mockSetTask,
      scaffoldType: [],
      setScaffoldType: mockSetScaffoldType,
      taskDesc: '',
      setTaskDesc: mockSetTaskDesc,
      updateTranslations: mockUpdateTranslations
    }));

    useTranslationLanguages.mockImplementation(() => ({
      fromLang: 'fi',
      toLangs: ['en', 'sv']
    }));

    performTranslations.mockImplementation(() =>
      Promise.resolve({ translations: { en: 'translated text' } })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders project information correctly', () => {
    const { getByText } = render(
      <TaskInfo project={mockProject} setToLangs={mockSetToLangs} />
    );

    expect(getByText('Test Project')).toBeTruthy();
    expect(getByText('TEST123')).toBeTruthy();
  });

  it('handles task description input', () => {
    const { getByTestId } = render(
      <TaskInfo project={mockProject} setToLangs={mockSetToLangs} />
    );

    const input = getByTestId('taskDesc');
    fireEvent.changeText(input, 'New task description');

    expect(mockSetTaskDesc).toHaveBeenCalledWith('New task description');
  });

  it('handles translation button press', async () => {
    useFormContext.mockImplementation(() => ({
      getFormData: mockGetFormData,
      task: [],
      setTask: mockSetTask,
      scaffoldType: [],
      setScaffoldType: mockSetScaffoldType,
      taskDesc: 'Test description',
      setTaskDesc: mockSetTaskDesc,
      updateTranslations: mockUpdateTranslations
    }));

    const { getByTestId } = render(
      <TaskInfo project={mockProject} setToLangs={mockSetToLangs} />
    );

    const translateButton = getByTestId('translate-button');
    fireEvent.press(translateButton);

    await waitFor(() => {
      expect(performTranslations).toHaveBeenCalledWith(
        'Test description',
        'fi',
        ['en', 'sv']
      );
      expect(mockUpdateTranslations).toHaveBeenCalled();
    });
  });

  it('disables translation button when task description is empty', () => {
    const { getByTestId } = render(
      <TaskInfo project={mockProject} setToLangs={mockSetToLangs} />
    );

    const translateButton = getByTestId('translate-button');
    expect(translateButton.props.accessibilityState.disabled).toBe(true);
  });

  it('renders error message when translation fails', async () => {
    const mockErrorMessage = 'Translation failed';

    useFormContext.mockImplementation(() => ({
      getFormData: mockGetFormData,
      task: [],
      setTask: mockSetTask,
      scaffoldType: [],
      setScaffoldType: mockSetScaffoldType,
      taskDesc: 'Test description',
      setTaskDesc: mockSetTaskDesc,
      updateTranslations: mockUpdateTranslations
    }));
  
    useTranslationLanguages.mockImplementation(() => ({
      fromLang: 'fi',
      toLangs: ['en', 'sv']
    }));

    performTranslations.mockImplementationOnce(() =>
      Promise.reject(new Error(mockErrorMessage))
    );
  
    const { getByTestId, getByText } = render(
      <TaskInfo project={mockProject} setToLangs={mockSetToLangs} />
    );
  
    const translateButton = getByTestId('translate-button');

    expect(translateButton.props.accessibilityState.disabled).toBe(false);
  
    fireEvent.press(translateButton);
  
    await waitFor(() => {
      expect(performTranslations).toHaveBeenCalledWith(
        'Test description',
        'fi',
        ['en', 'sv']
      );
      expect(getByText(mockErrorMessage)).toBeTruthy();
    });
  });

  it('calls setTask with selected value when MultiChoiceButtonGroup changes', () => {
    const mockSelectedTask = ['installation'];
  
    const { getByText } = render(
      <TaskInfo project={mockProject} setToLangs={mockSetToLangs} />
    );

    const optionButton = getByText('riskform.installation');
    fireEvent.press(optionButton);

    expect(mockSetTask).toHaveBeenCalledWith(mockSelectedTask);
  });
});
