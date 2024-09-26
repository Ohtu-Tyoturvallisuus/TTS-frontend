import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import useFetchWorksites from '../hooks/useFetchWorksites';

import WorksiteModal from './WorksiteModal';

const WorksitesList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const local_ip = Constants.expoConfig.extra.local_ip

  // Custom hook for fetching worksites
  const worksites = useFetchWorksites(local_ip);

  const WorksiteButton = ({ item }) => (
    <View style={styles.worksiteContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSelectedWorksite(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.worksiteTitle}>{item.name}</Text>
        <Text style={styles.worksiteLocation}>Sijainti: {item.location}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Työmaat</Text>
      <FlatList
        data={worksites}
        renderItem={WorksiteButton}
        keyExtractor={worksite => worksite.id.toString()}
      />
      <WorksiteModal
        visible={modalVisible}
        worksite={selectedWorksite}
        onClose={() => setModalVisible(false)}
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
  worksiteContainer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  worksiteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  worksiteLocation: {
    color: '#FFFFFF',
  },
});

export default WorksitesList;