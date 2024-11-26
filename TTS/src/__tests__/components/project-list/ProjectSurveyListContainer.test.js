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
        scaffold_type: ['Type 1', 'Type 2'],
        task: ['Task 1'],
        url: 'https://example.com/survey1',
      },
      {
        id: 2,
        created_at: new Date().toISOString(),
        scaffold_type: ['Type 3'],
        task: ['Task 2', 'Task 3'],
        url: 'https://example.com/survey2',
      },
    ],
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations = {
        'projectsurveylistcontainer.minutesAgo_one': 'yksi minuutti sitten',
        'projectsurveylistcontainer.minutesAgo_other': '{{count}} minuuttia sitten',
        'projectsurveylistcontainer.hoursAgo_one': 'yksi tunti sitten',
        'projectsurveylistcontainer.hoursAgo_other': '{{count}} tuntia sitten',
        'projectsurveylistcontainer.daysAgo_one': 'yksi päivä sitten',
        'projectsurveylistcontainer.daysAgo_other': '{{count}} päivää sitten',
        'projectsurveylistcontainer.useTemplate': 'Käytä pohjana',
        'projectsurveylistcontainer.noSurveys': 'Ei kartoituksia saatavilla.',
        'scaffoldTypes.Type 1': 'Tyyppi 1',
        'riskform.Task 1': 'Tehtävä 1',
        'scaffoldTypes.Type 2': 'Tyyppi 2',
        'riskform.Task 2': 'Tehtävä 2',
        'scaffoldTypes.Type 3': 'Tyyppi 3',
        'riskform.Task 3': 'Tehtävä 3',
      };

      let translation = translations[key] || key;

      if (options && options.count !== undefined) {
        if (options.count === 1) {
          translation = translations[`${key}_one`] || translation;
        } else {
          translation = translations[`${key}_other`] || translation;
        }
        translation = translation.replace('{{count}}', options.count);
      }

      return translation;
    },
  }),
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
        scaffold_type: ['Type 1', 'Type 2'],
        task: ['Task 1'],
        url: 'https://example.com/survey1',
      },
      {
        id: 2,
        created_at: new Date().toISOString(),
        scaffold_type: ['Type 3'],
        task: ['Task 2', 'Task 3'],
        url: 'https://example.com/survey2',
      },
    ];

    const mockNavigateToRiskForm = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigateToRiskForm={mockNavigateToRiskForm}
        />
      </ProjectSurveyContext.Provider>
    );

    expect(getByText('Tyyppi 1, Tyyppi 2: Tehtävä 1')).toBeTruthy();
    expect(getByText('Tyyppi 3: Tehtävä 2, Tehtävä 3')).toBeTruthy();
  });

  it('displays "X tuntia sitten" when the survey was created less than 24 hours ago', () => {
    const mockSurveys = [
      {
        id: 1,
        created_at: new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        scaffold_type: ['Type 1'],
        task: ['Task 1'],
        url: 'https://example.com/survey1',
      },
    ];

    const mockNavigateToRiskForm = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigateToRiskForm={mockNavigateToRiskForm}
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
        scaffold_type: ['Type 1'],
        task: ['Task 1'],
        url: 'https://example.com/survey1',
      },
    ];

    const mockNavigateToRiskForm = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigateToRiskForm={mockNavigateToRiskForm}
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
        scaffold_type: ['Type 1'],
        task: ['Task 1'],
        url: 'https://example.com/survey1',
      },
    ];
  
    const mockNavigateToRiskForm = jest.fn();
  
    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigateToRiskForm={mockNavigateToRiskForm}
        />
      </ProjectSurveyContext.Provider>
    );

    const surveyDate = new Date(mockSurveys[0].created_at);
    const userLocale = 'fi-FI';
    const formattedDate = surveyDate.toLocaleDateString(userLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedTime = surveyDate.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit',
    });
    const expectedDate = `${formattedDate}, ${formattedTime}`;

    expect(getByText(expectedDate)).toBeTruthy();
  });

  it('displays a message when no surveys are available', () => {
    const { getByText } = render(<ProjectSurveyListContainer surveys={[]} />);

    expect(getByText('Ei kartoituksia saatavilla.')).toBeTruthy();
  });

  it('uses the default empty array for surveys when not passed', () => {
    const mockNavigateToRiskForm = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectSurveyListContainer
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigateToRiskForm={mockNavigateToRiskForm}
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
        scaffold_type: ['Type 1'],
        task: ['Task 1'],
        url: 'https://example.com/survey1',
      },
    ];

    const mockNavigateToRiskForm = jest.fn();

    const { getByText } = render(
      <ProjectSurveyContext.Provider value={{ setSelectedSurveyURL: mockProjectContext.setSelectedSurveyURL }}>
        <ProjectSurveyListContainer
          surveys={mockSurveys}
          setSelectedSurveyURL={mockProjectContext.setSelectedSurveyURL}
          navigateToRiskForm={mockNavigateToRiskForm}
        />
      </ProjectSurveyContext.Provider>
    );

    fireEvent.press(getByText('Käytä pohjana'));

    expect(mockProjectContext.setSelectedSurveyURL).toHaveBeenCalledWith('https://example.com/survey1');
    expect(mockNavigateToRiskForm).toHaveBeenCalled();
  });
});
