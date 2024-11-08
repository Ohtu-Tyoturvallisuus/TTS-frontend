import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectSurveyList from '@components/project-list/ProjectSurveyList';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';

jest.mock('@hooks/useFetchSurveys', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    surveys: [
      {
        id: 1,
        created_at: new Date().toISOString(),
        scaffold_type: 'Type 1',
        task: 'Task 1',
        url: 'https://example.com/survey1',
      },
      {
        id: 2,
        created_at: new Date().toISOString(),
        scaffold_type: 'Type 2',
        task: 'Task 2',
        url: 'https://example.com/survey2',
      },
    ],
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'projectsurveylist.loadingSurveys': 'Ladataan kartoituksia...',
        'projectsurveylistcontainer.noSurveys': 'Ei kartoituksia saatavilla.',
        'loading.error': 'Virhe lataamisessa'
      };
      return translations[key] || key;
    },
  }),
}));

describe('ProjectSurveyList Component', () => {
  const mockSetSelectedSurveyURL = jest.fn();
  const mockProjectContext = {
    selectedProject: { id: 123, formattedName: 'Test Project' },
    setSelectedSurveyURL: mockSetSelectedSurveyURL,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls setSelectedSurveyURL and navigate when a survey is selected', () => {
    const mockNavigateToRiskForm = jest.fn();

    const { getByTestId } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyList navigateToRiskForm={mockNavigateToRiskForm} />
      </ProjectSurveyContext.Provider>
    );

    fireEvent.press(getByTestId('use-survey-1'));

    expect(mockSetSelectedSurveyURL).toHaveBeenCalledWith('https://example.com/survey1');
    expect(mockNavigateToRiskForm).toHaveBeenCalled();
  });

  it('displays message when there are no surveys', () => {
    require('@hooks/useFetchSurveys').default.mockReturnValue({});

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyList />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('Ei kartoituksia saatavilla.')).toBeTruthy();
  });

  it('displays loading state', () => {
    require('@hooks/useFetchSurveys').default.mockReturnValue({
      surveys: [],
      loading: true,
      error: null,
    });

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyList />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('Ladataan kartoituksia...')).toBeTruthy();
  });

  it('displays error state', () => {
    require('@hooks/useFetchSurveys').default.mockReturnValue({
      surveys: [],
      loading: false,
      error: new Error('Something went wrong'),
    });

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyList />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('Virhe lataamisessa')).toBeTruthy();
  });
});
