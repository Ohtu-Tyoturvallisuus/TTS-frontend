import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import useFetchProjects from '../hooks/useFetchProjects';
import { ProjectSurveyContext } from '../contexts/ProjectSurveyContext';
import ProjectModal from './ProjectModal';
import SelectProject from './SelectProject';

const ProjectsList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {selectedProject, setSelectedProject} = useContext(ProjectSurveyContext);
  const [searchInput, setSearchInput] = useState('Valitse kaupunki');
  console.log('Selected project:', selectedProject);
  const local_ip = Constants.expoConfig.extra.local_ip
  // Custom hook for fetching projects
  const projects = useFetchProjects(local_ip);
  console.log('Projects:', projects[1]);

  const formattedProjects = projects.map(project => project.formattedName);

  const ProjectButton = ({ item: project }) => (
    <View style={styles.projectContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSelectedProject(project);
          setModalVisible(true);
        }}
      >
        <Text style={styles.projectTitle}>{project.formattedName}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={ProjectButton}
        keyExtractor={project => project.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Projektit</Text>
            {/* <SelectProject setFilter={setSearchInput} projects={formattedProjects} /> */}
          </>
        }
      />
      <ProjectModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          // Reset selected project if closed
          setSelectedProject(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  projectContainer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  projectLocation: {
    color: '#FFFFFF',
  },
});

export default ProjectsList;