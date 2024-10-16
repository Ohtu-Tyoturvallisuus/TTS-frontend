import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectModal from '../../components/ProjectModal';
import { ProjectSurveyContext } from '../../contexts/ProjectSurveyContext';

jest.mock('../../components/SurveyList', () => 'SurveyList');
jest.mock('../../components/risk_form/RiskFormButton', () => 'RiskFormButton');

describe('ProjectModal Component', () => {
  const mockOnClose = jest.fn();

  const mockProjectContext = {
    selectedProject: {
      formattedName: 'Test Project',
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClose when the close button is pressed', () => {
    const { getByText } = render(
      <ProjectSurveyContext.Provider value={mockProjectContext}>
        <ProjectModal visible={true} onClose={mockOnClose} />
      </ProjectSurveyContext.Provider>
    );

    fireEvent.press(getByText('Close'));
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
