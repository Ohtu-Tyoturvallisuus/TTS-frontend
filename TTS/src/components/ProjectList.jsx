import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import useFetchProjects from '../hooks/useFetchProjects';
import { ProjectSurveyContext } from '../contexts/ProjectSurveyContext';
import ProjectModal from './ProjectModal';
import SearchBar from './SearchBar';
import DropdownOptions from './DropdownOptions';

const ProjectsList = () => {
  const local_ip = Constants.expoConfig.extra.local_ip
  const [modalVisible, setModalVisible] = useState(false);
  const {setSelectedProject} = useContext(ProjectSurveyContext);
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);  

  const projects = useFetchProjects(local_ip);
  console.log('Project example:', projects[1]);
  
  const [areaFilter, setAreaFilter] = useState([]);
  const projectAreas = [
    ["--Valitse kaikki--", ""],
    ["Hallinto", "AL90"],
    ["Etelä-Suomi", "AL31"],
    ["Sisä-Suomi", "AL41"],
    ["Länsi-Suomi", "AL34"],
    ["Keski-Suomi", "AL51"],
    ["Kaakkois-Suomi", "AL52"],
    ["Itä-Suomi", "AL53"],
    ["Pohjois-Suomi", "AL54"],
    ["Kataja Event", "3100"],
    ["SCAF Common", "SCAF"],
    ["EVENT Common", "EVENT"]
];

// filteredProjects is updated whenever areaFilter or searchFilter changes
useEffect(() => {
  let filtered = projects;
  if (areaFilter) {
    filtered = filtered.filter(project => {
      const [areaCode] = project.dimension_display_value.split('|');
      const includesArea = areaCode.includes(areaFilter[1]);
      return includesArea;
    });
  }
  if (searchFilter) {
    filtered = filtered.filter(project =>
      project.formattedName.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }
  setFilteredProjects(filtered);
}, [areaFilter, searchFilter, projects]);

  const ProjectButton = ({ item: project }) => (
    <View style={styles.projectContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSelectedProject(project);
          setModalVisible(true);
        }}
      >
        <Text style={styles.projectTitle}>
          {project.formattedName} ({project.dimension_display_value.split('|')[0]})
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProjects}
        renderItem={ProjectButton}
        keyExtractor={project => project.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Projektit</Text>
            <DropdownOptions 
              onSelect={setAreaFilter} 
              options={projectAreas}
              placeholderText='Valitse alue'
              />
            <SearchBar setFilter={setSearchFilter} />
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
  button: {
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: 10,
  },
  container: {
    display: 'flex',
    padding: 16,
  },
  projectContainer: {
    marginBottom: 16,
  },
  projectTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ProjectsList;