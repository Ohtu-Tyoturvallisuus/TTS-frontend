import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectButton from '@components/buttons/ProjectButton';

describe('ProjectButton', () => {
  const mockProject = {
    project_id: '12345',
    project_name: 'Test Project',
    dimension_display_value: 'Dimension1|Other'
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders project information correctly', () => {
    const { getByText } = render(
      <ProjectButton project={mockProject} onPress={mockOnPress} />
    );

    expect(getByText(/\[12345\]/)).toBeTruthy();
    expect(getByText(/Test Project/)).toBeTruthy();
    expect(getByText(/\(Dimension1\)/)).toBeTruthy();

    const button = getByText(/.*\[12345\].*Test Project.*\(Dimension1\).*/);
    expect(button).toBeTruthy();
  });

  it('calls onPress with project data when pressed', () => {
    const { getByText } = render(
      <ProjectButton project={mockProject} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('[12345] Test Project (Dimension1)'));
    expect(mockOnPress).toHaveBeenCalledWith(mockProject);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('highlights matching text when searchText is provided', () => {
    const { getAllByText } = render(
      <ProjectButton
        project={mockProject}
        onPress={mockOnPress}
        searchText="test"
      />
    );

    const highlightedElements = getAllByText('Test');
    expect(highlightedElements[0].props.style).toMatchObject({
      backgroundColor: '#FFEB3B',
      color: '#000000'
    });
  });

  it('handles case-insensitive search highlighting', () => {
    const { getAllByText } = render(
      <ProjectButton
        project={mockProject}
        onPress={mockOnPress}
        searchText="TEST"
      />
    );

    const highlightedElements = getAllByText('Test');
    expect(highlightedElements[0].props.style).toMatchObject({
      backgroundColor: '#FFEB3B',
      color: '#000000'
    });
  });

  it('renders without highlighting when no searchText provided', () => {
    const { getByText } = render(
      <ProjectButton project={mockProject} onPress={mockOnPress} />
    );

    const projectText = getByText(/.*Test Project.*/);

    expect(projectText).toBeTruthy();
    expect(projectText.props.style).not.toMatchObject({
      backgroundColor: '#FFEB3B',
      color: '#000000'
    });
  });

  it('handles empty project values gracefully', () => {
    const emptyProject = {
      project_id: '',
      project_name: '',
      dimension_display_value: '|'
    };

    const { getByText } = render(
      <ProjectButton project={emptyProject} onPress={mockOnPress} />
    );

    const projectElement = getByText(/\[\].*\(\)/);
    expect(projectElement).toBeTruthy();
  });
});
