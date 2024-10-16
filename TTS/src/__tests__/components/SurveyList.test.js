import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SurveyList from '../../components/SurveyList';
import { ProjectSurveyContext } from '../../contexts/ProjectSurveyContext';
import { useNavigate } from 'react-router-native';

jest.mock('react-router-native', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../hooks/useFetchSurveys', () => ({
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

describe('SurveyList Component', () => {
  const mockSetSelectedSurveyURL = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls setSelectedSurveyURL and navigate when a survey is selected', () => {
    const mockProjectContext = {
      selectedProject: { id: 123, formattedName: 'Test Project' },
      setSelectedSurveyURL: mockSetSelectedSurveyURL,
    };

    const { getByTestId } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <SurveyList />
      </ProjectSurveyContext.Provider>
    );

    fireEvent.press(getByTestId('use-survey-1'));

    expect(mockSetSelectedSurveyURL).toHaveBeenCalledWith('https://example.com/survey1');
    expect(mockNavigate).toHaveBeenCalledWith('worksafetyform');
  });

  it('displays message when there are no surveys', () => {
    require('../../hooks/useFetchSurveys').default.mockReturnValue({});

    const mockProjectContext = {
      selectedProject: { id: 123, formattedName: 'Test Project' },
      setSelectedSurveyURL: mockSetSelectedSurveyURL,
    };

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <SurveyList />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('Ei kartoituksia saatavilla.')).toBeTruthy();
  });
});
