import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProjectSurveyContext, ProjectSurveyProvider } from '@contexts/ProjectSurveyContext';
import { Text, Button } from 'react-native';

const TestComponent = () => {
  const { selectedProject, setSelectedProject, selectedSurveyURL, setSelectedSurveyURL, resetProjectAndSurvey } = useContext(ProjectSurveyContext);

  return (
    <>
      <Text testID="project">{selectedProject ? selectedProject : 'No project selected'}</Text>
      <Text testID="surveyURL">{selectedSurveyURL ? selectedSurveyURL : 'No survey URL selected'}</Text>

      <Button title="Set Project" onPress={() => setSelectedProject('New Project')} />
      <Button title="Set Survey URL" onPress={() => setSelectedSurveyURL('https://survey.example.com')} />
      <Button title="Reset" onPress={resetProjectAndSurvey} />
    </>
  );
};

describe('ProjectSurveyProvider', () => {
  it('should provide default values and allow updating project and survey URL', () => {
    const { getByTestId, getByText } = render(
      <ProjectSurveyProvider>
        <TestComponent />
      </ProjectSurveyProvider>
    );

    expect(getByTestId('project').props.children).toBe('No project selected');
    expect(getByTestId('surveyURL').props.children).toBe('No survey URL selected');

    fireEvent.press(getByText('Set Project'));
    expect(getByTestId('project').props.children).toBe('New Project');

    fireEvent.press(getByText('Set Survey URL'));
    expect(getByTestId('surveyURL').props.children).toBe('https://survey.example.com');

    fireEvent.press(getByText('Reset'));

    expect(getByTestId('project').props.children).toBe('No project selected');
    expect(getByTestId('surveyURL').props.children).toBe('No survey URL selected');
  });
});
