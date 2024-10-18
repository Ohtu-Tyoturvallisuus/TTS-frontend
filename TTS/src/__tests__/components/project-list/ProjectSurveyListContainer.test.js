import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProjectSurveyListContainer } from '@components/project-list/ProjectSurveyList';
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

describe('ProjectSurveyListContainer Component', () => {
  const mockProjectContext = {
    setSelectedSurveyURL: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with surveys', () => {
    const mockSurveys = [
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
    ];

    const mockNavigate = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigate={mockNavigate}
        />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('Type 1: Task 1')).toBeTruthy();
    expect(getByText('Type 2: Task 2')).toBeTruthy();
  });

  it('displays "X tuntia sitten" when the survey was created less than 24 hours ago', () => {
    const mockSurveys = [
      {
        id: 1,
        created_at: new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        scaffold_type: 'Type 1',
        task: 'Task 1',
        url: 'https://example.com/survey1',
      },
    ];

    const mockNavigate = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigate={mockNavigate}
        />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('5 tuntia sitten')).toBeTruthy();
  });

  it('displays "X päivää sitten" when the survey was created less than 14 days ago', () => {
    const mockSurveys = [
      {
        id: 1,
        created_at: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        scaffold_type: 'Type 1',
        task: 'Task 1',
        url: 'https://example.com/survey1',
      },
    ];

    const mockNavigate = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigate={mockNavigate}
        />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('5 päivää sitten')).toBeTruthy();
  });

  it('displays the full date and time for surveys older than 14 days', () => {
    const mockSurveys = [
      {
        id: 1,
        created_at: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        scaffold_type: 'Type 1',
        task: 'Task 1',
        url: 'https://example.com/survey1',
      },
    ];

    const mockNavigate = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigate={mockNavigate}
        />
      </ProjectSurveyContext.Provider>
    );

    // Format the expected date output as `DD.MM.YYYY, klo HH.MM`
    const surveyDate = new Date(mockSurveys[0].created_at);
    const expectedDate = `${surveyDate.toLocaleDateString()}, klo ${surveyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    expect(getByText(expectedDate)).toBeTruthy();
  });

  it('displays a message when no surveys are available', () => {
    const { getByText } = render(<ProjectSurveyListContainer surveys={[]} />);

    expect(getByText('Ei kartoituksia saatavilla.')).toBeTruthy();
  });

  it('uses the default empty array for surveys when not passed', () => {
    const mockNavigate = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigate={mockNavigate}
        />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('Ei kartoituksia saatavilla.')).toBeTruthy();
  });

  it('calls setSelectedSurveyURL and navigate when a survey is selected', () => {
    const mockSurveys = [
      {
        id: 1,
        created_at: new Date().toISOString(),
        scaffold_type: 'Type 1',
        task: 'Task 1',
        url: 'https://example.com/survey1',
      },
    ];

    const mockNavigate = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={{ setSelectedSurveyURL: mockProjectContext.setSelectedSurveyURL }}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigate={mockNavigate}
        />
      </ProjectSurveyContext.Provider>
    );

    fireEvent.press(getByText('Käytä pohjana'));

    expect(mockProjectContext.setSelectedSurveyURL).toHaveBeenCalledWith('https://example.com/survey1');
    expect(mockNavigate).toHaveBeenCalledWith('worksafetyform');
  });
});
