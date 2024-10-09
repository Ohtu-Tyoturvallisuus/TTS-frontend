import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ProjectSurveyContext } from '../contexts/ProjectSurveyContext';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';

const SurveyList = () => {
  const { selectedProject: project, setSelectedSurveyURL } = useContext(ProjectSurveyContext);
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState([]);

  // Like this for now, but we should use the local_ip from the context
  const local_ip = Constants.expoConfig.extra.local_ip;

  useEffect(() => {
    if (project && project.id) {
      console.log('Fetching surveys for project id:', project.id);
      fetch(`http://${local_ip}:8000/api/projects/${project.id}/`)
        .then(response => response.json())
        .then(data => {
          setSurveys(data.surveys || []);
        })
        .catch(error => {
          console.error('Error fetching surveys:', error);
        });
    }
  }, [project]);

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
            style={styles.button}
            onPress={() => {
              console.log('Valittu kartoitus:', survey);
              setSelectedSurveyURL(survey.url);
              navigate('worksafetyform')
            }}
          >
            <Text style={styles.buttonText}>Käytä pohjana</Text>
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
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    maxHeight: 300, 
  },
  surveyContainer: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  surveyDate: {
    color: '#555',
    fontSize: 12,
  },
  surveyInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  surveyTitle: {
    fontWeight: 'bold',
  },
});

export default SurveyList;