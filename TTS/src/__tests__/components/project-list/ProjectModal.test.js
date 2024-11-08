import { render, fireEvent } from '@testing-library/react-native';
import ProjectModal from '@components/project-list/ProjectModal';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';

jest.mock('@components/project-list/ProjectSurveyList', () => {
  const { Text } = require('react-native');
  const MockedSurveyList = () => {
    return <Text>Mocked Survey List</Text>;
  };
  MockedSurveyList.displayName = 'MockedSurveyList';
  return MockedSurveyList;
});

jest.mock('@components/buttons/CloseButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  const MockedCloseButton = (props) => {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <Text>Sulje</Text>
      </TouchableOpacity>
    );
  };
  MockedCloseButton.displayName = 'MockedCloseButton';
  return MockedCloseButton;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'projectmodal.title': 'Täytä uusi riskilomake',
        'closebutton.close': 'Sulje'
      };
      return translations[key] || key;
    },
  }),
}));

describe('ProjectModal Component', () => {
  const mockOnClose = jest.fn();

  const mockProjectContext = {
    selectedProject: {
      formattedName: 'Test Project',
    },
    setSelectedSurveyURL: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to RiskForm when selecting to fill a new risk form', () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectModal visible={true} onClose={mockOnClose} navigateToRiskForm={mockNavigate} />
      </ProjectSurveyContext.Provider>
    );

    fireEvent.press(getByText('Täytä uusi riskilomake'));
    expect(mockProjectContext.setSelectedSurveyURL).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('calls onClose when the close button is pressed', () => {
    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectModal visible={true} onClose={mockOnClose} />
      </ProjectSurveyContext.Provider>
    );

    fireEvent.press(getByText('Sulje'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render when project is not available', () => {
    const mockEmptyContext = {
      selectedProject: null,
    };

    const { queryByText } = render(
      <ProjectSurveyContext.Provider value={mockEmptyContext}>
        <ProjectModal visible={true} onClose={mockOnClose} />
      </ProjectSurveyContext.Provider>
    );

    expect(queryByText('Test Project')).toBeNull();
  });

  it('does not render when the modal is not visible', () => {
    const { queryByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectModal visible={false} onClose={mockOnClose} />
      </ProjectSurveyContext.Provider>
    );

    expect(queryByText('Test Project')).toBeNull();
  });
});
