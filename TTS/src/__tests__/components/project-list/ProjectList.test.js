import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import ProjectsList from '@components/project-list/ProjectList';
import useFetchProjects from '@hooks/useFetchProjects';
import getProjectAreas from '@utils/projectAreas';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'projectlist.projects': 'Projects',
        'projectlist.errorFetchingProjects': 'Error fetching projects',
      };
      return translations[key] || key;
    }
  }),
}));

jest.mock('@hooks/useFetchProjects', () => jest.fn((_, __, searchFilter) => {
  console.log('searchFilter:', searchFilter);
  const projects = [
    { id: 1, name: 'Project A' },
    { id: 2, name: 'Project B' },
  ];
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase())
  );
  return {
    projects: filteredProjects,
    loading: false,
    error: null,
  };
}));

const mockNavigation = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigation,
    }),
  };
});

jest.mock('@utils/projectAreas');
jest.mock('@components/buttons/ProjectButton', () => jest.fn(({ project, onPress }) => {
  const { Text, TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity onPress={() => onPress(project)}>
      <Text>{project.name}</Text>
    </TouchableOpacity>
  );
}));

jest.mock('@components/DropdownOptions', () => jest.fn(({ onSelect }) => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return (
    <View>
      <TouchableOpacity onPress={() => onSelect(["Area 1", "A1"])}>
        <Text>Area 1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelect(null)}>
        <Text>All Areas</Text>
      </TouchableOpacity>
    </View>
  );
}));

jest.mock('@components/SearchBar', () => jest.fn(({ value, onChange }) => {
  const { TextInput } = require('react-native');
  return <TextInput value={value} onChangeText={onChange} testID='searchbar' />;
}));

jest.mock('@components/project-list/ProjectModal', () => jest.fn(({ visible, onClose, navigateToRiskForm }) => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return visible ? (
    <View>
      <Text>Modal</Text>
      <TouchableOpacity onPress={navigateToRiskForm}>
        <Text>Navigate to RiskForm</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  ) : null;
}));

describe('ProjectsList Component', () => {
  const mockSetSelectedProject = jest.fn();

  const setup = () => {
    return render(
      <NavigationContainer>
        <ProjectSurveyContext.Provider value={{ setSelectedProject: mockSetSelectedProject }}>
            <ProjectsList />
        </ProjectSurveyContext.Provider>
      </NavigationContainer>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getProjectAreas.mockReturnValue([
      ["All", ""],
      ["Area 1", "A1"],
      ["Area 2", "A2"],
    ]);
  });

  it('renders loading state correctly', () => {
    useFetchProjects.mockReturnValue({
      projects: [],
      loading: true,
      error: null,
    });

    const { getByTestId } = setup();

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders error state correctly', () => {
    useFetchProjects.mockReturnValue({
      projects: [],
      loading: false,
      error: 'Error fetching projects',
    });

    const { getByText } = setup();

    expect(getByText('Error fetching projects')).toBeTruthy();
  });

  it('opens and closes the modal when a project is selected', async () => {
    useFetchProjects.mockReturnValue({
      projects: [{ id: 1, name: 'Project A' }],
      loading: false,
      error: null,
    });

    const { getByText, queryByText } = setup();

    fireEvent.press(getByText('Project A'));

    expect(mockSetSelectedProject).toHaveBeenCalledWith({ id: 1, name: 'Project A' });
    expect(getByText('Modal')).toBeTruthy();

    fireEvent.press(getByText('Close'));

    await waitFor(() => {
      expect(queryByText('Modal')).toBeNull();
    });
  });

  it('navigates to RiskForm when the modal navigateToRiskForm is triggered', () => {
    useFetchProjects.mockReturnValue({
      projects: [{ id: 1, name: 'Project A' }],
      loading: false,
      error: null,
    });

    const { getByText } = setup();

    fireEvent.press(getByText('Project A'));

    fireEvent.press(getByText('Navigate to RiskForm'));

    expect(mockNavigation).toHaveBeenCalledWith('RiskForm');
  });
});
