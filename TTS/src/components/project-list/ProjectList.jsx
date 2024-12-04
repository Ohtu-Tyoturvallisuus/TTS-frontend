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
import getProjectAreas from '@utils/projectAreas';
import { NavigationContext } from '@contexts/NavigationContext';

const ProjectsList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { setSelectedProject } = useContext(ProjectSurveyContext);
  const { setCurrentLocation } = useContext(NavigationContext);
  const [displayedSearch, setDisplayedSearch] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { t } = useTranslation();
  const [areaFilter, setAreaFilter] = useState("");
  const [dropdownKey, setDropdownKey] = useState(0);
  const navigation = useNavigation();
  const projectAreas = getProjectAreas();
  const shouldFetchProjects = Boolean(areaFilter.length || searchFilter.trim());

  const { projects, loading, error } = useFetchProjects(
    areaFilter,
    "", // DataAreaId not in use
    searchFilter,
    shouldFetchProjects // Should be true only if some filtering criteria is given
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
      setDropdownKey(prevKey => prevKey + 1);
      return;
    }
    const selectedArea = projectAreas.find(area => area[0] === value);
    if (selectedArea) {
      console.log('Area filter changed:', selectedArea[1]);
      setAreaFilter(selectedArea[1]);
    }
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
              key={dropdownKey}
              options={projectAreas.map(area => area[0])}
              onSelect={handleAreaFilterChange}
              placeholderText={t('projectlist.chooseArea')}
            />
            <SearchBar value={displayedSearch} onChange={handleSearchChange}/>
            {loading && (
              <View className='pt-1'>
                <ActivityIndicator testID='loading-indicator' size='large' color="#ef7d00" />
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
          </View>
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
          setCurrentLocation('RiskForm');
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
