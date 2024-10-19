import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import useFetchProjects from '@hooks/useFetchProjects';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import ProjectModal from '@components/project-list/ProjectModal';
import SearchBar from '@components/SearchBar';
import DropdownOptions from '@components/DropdownOptions';
import Loading from '@components/Loading';

const ProjectsList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { setSelectedProject } = useContext(ProjectSurveyContext);
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { t } = useTranslation();
  const { projects, loading, error } = useFetchProjects();
  console.log('Project example:', projects[1]);
  
  const [areaFilter, setAreaFilter] = useState([]);
  const projectAreas = [
    [t('projectlist.chooseAll'), ""],
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

  if (loading || error) {
    return (
      <Loading 
        loading={loading} 
        error={error} 
        title={t('projectlist.loading')}
      />
    );
  }

  const ProjectButton = ({ item: project }) => (
    <View style={styles.projectContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSelectedProject(project);
          setModalVisible(true);
        }}
      >
        <Text style={styles.projectText}>
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
            <Text style={styles.title}>{t('projectlist.projects')}</Text>
            <DropdownOptions 
              onSelect={setAreaFilter} 
              options={projectAreas}
              placeholderText={t('projectlist.chooseArea')}
              />
            <SearchBar setFilter={setSearchFilter} />
          </>
        }
      />
      <ProjectModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
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
  projectText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left', 
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ProjectsList;