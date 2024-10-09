import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ProjectSurveyContext } from '../contexts/ProjectSurveyContext';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import useFetchSurveys from '../hooks/useFetchSurveys';

const SurveyList = () => {
  const { selectedProject: project, setSelectedSurveyURL } = useContext(ProjectSurveyContext);
  const navigate = useNavigate()
  const { surveys, loading, error } = useFetchSurveys(project.id);

  const renderSurveyOption = ({ item: survey }) => {
    const surveyDate = new Date(survey.created_at);
    const formattedDate = `${surveyDate.toLocaleDateString()}, klo ${surveyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
      <View style={styles.surveyContainer}>
        <View style={styles.surveyInfo}>
          <Text style={styles.surveyTitle}>{survey.title}</Text>
          <Text style={styles.surveyDate}>{formattedDate}</Text>
        </View>
        <View>
          <TouchableOpacity 
            style={[styles.button]}
            onPress={() => {
              console.log('Valittu kartoitus:', survey);
              setSelectedSurveyURL(survey.url);
              navigate('worksafetyform')
            }}
          >
            <Text style={[styles.buttonText]}>Käytä pohjana</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Text>Tehdyt kartoitukset:</Text>
      {surveys.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={surveys}
            renderItem={renderSurveyOption}
            keyExtractor={survey => survey.id.toString()}
          />
        </View>
      ) : (
        <Text>Ei kartoituksia saatavilla.</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    maxHeight: 300, 
  },
  surveyContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surveyInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  surveyTitle: {
    fontWeight: 'bold',
  },
  surveyDate: {
    fontSize: 12,
    color: '#555',
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SurveyList;