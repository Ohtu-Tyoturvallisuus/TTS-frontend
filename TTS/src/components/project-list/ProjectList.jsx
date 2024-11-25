import React, { useContext, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';

import useFetchProjects from '@hooks/useFetchProjects';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import ProjectButton from '@components/buttons/ProjectButton';
import ProjectModal from '@components/project-list/ProjectModal';
import SearchBar from '@components/SearchBar';
import DropdownOptions from '@components/DropdownOptions';

const ProjectsList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { setSelectedProject } = useContext(ProjectSurveyContext);
  const [displayedSearch, setDisplayedSearch] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { t } = useTranslation();
  const [areaFilter, setAreaFilter] = useState([]);
  const navigation = useNavigation();
  const projectAreas = [
    [t('projectlist.chooseAll'), ""],
    ["Kataja Event", "3100"],
    ["Kattilaryhmä", "AL21"],
    ["Etelä-Suomi", "AL31"],
    ["Kilpilahti", "AL32"],
    ["Länsi-Suomi", "AL34"],
    ["Lounais-Suomi", "AL35"],
    ["Sisä-Suomi", "AL41"],
    ["Pohjanmaa", "AL50"],
    ["Keski-Suomi", "AL51"],
    ["Kaakkois-Suomi", "AL52"],
    ["Itä-Suomi", "AL53"],
    ["Pohjois-Suomi", "AL54"],
    ["Hallinto", "AL90"],
    ["Tuotemyynti", "AL91"],
    ["AS Telinekataja (Event)", "EVENT"],
    ["AS Telinekataja (Scaf)", "SCAF"]
  ];
  const shouldFetchProjects = Boolean(areaFilter.length || searchFilter.trim());

  const { projects, loading, error } = useFetchProjects(
    areaFilter,
    "", // DataAreaId not in use
    searchFilter,
    shouldFetchProjects // Fetches only if filtering criteria is given
  );

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const debouncedSetSearchFilter = useMemo(
    () => debounce((value) => {
      setSearchFilter(value);
    }, 750),
    []
  );

  const handleSearchChange = (value) => {
    setDisplayedSearch(value);
    debouncedSetSearchFilter(value);
  };

  const handleAreaFilterChange = (value) => {
    if (value === null) {
      console.log('Area filter changed: All');
      setAreaFilter([]);
      return;
    }
    console.log('Area filter changed:', value[1]);
    setAreaFilter(value[1]);
  };

  const handleProjectPress = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  useEffect(() => {
    return () => {
      debouncedSetSearchFilter.cancel();
    };
  }, [debouncedSetSearchFilter]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProjects}
        renderItem={({ item }) => (
          <ProjectButton
            project={item}
            onPress={handleProjectPress}
            searchText={displayedSearch}
          />
        )}
        keyExtractor={project => project.id.toString()}
        ListHeaderComponent={
          <View className="px-2">
            <Text style={styles.title}>{t('projectlist.projects')}</Text>
            <DropdownOptions
              onSelect={handleAreaFilterChange}
              options={projectAreas}
              placeholderText={t('projectlist.chooseArea')}
            />
            <SearchBar value={displayedSearch} onChange={handleSearchChange}/>
            {loading && (
              <View className='pt-1'>
                <ActivityIndicator size='large' color="#ef7d00" />
              </View>
            )}
            {!loading && !error && shouldFetchProjects && (
              <Text style={styles.projectCount}>
                {t('projectlist.projectsFound', { count: filteredProjects.length })}
              </Text>
            )}
            {error && (
              <View >
                <Text style={{ color: 'red' }}>{t('projectlist.errorFetchingProjects')}</Text>
              </View>
            )}
          </>
        }
      />
      <ProjectModal
        visible={modalVisible}
        onClose={() => {
          setSelectedProject(null);
          setModalVisible(false);
        }}
        navigateToRiskForm={() => {
          setModalVisible(false);
          navigation.navigate('RiskForm');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    display: 'flex',
    height: '100%',
    paddingHorizontal: 10,
  },
  projectCount: {
    color: '#666',
    fontSize: 14,
    paddingVertical: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ProjectsList;
