import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ProjectSurveyContext } from '../contexts/ProjectSurveyContext';
import { useNavigate } from 'react-router-native';
import useFetchSurveys from '../hooks/useFetchSurveys';

const SurveyList = () => {
  const { selectedProject: project, setSelectedSurveyURL } = useContext(ProjectSurveyContext);
  const navigate = useNavigate()
  const { surveys } = useFetchSurveys(project.id);

  const renderSurveyOption = ({ item: survey }) => {
    const surveyDate = new Date(survey.created_at);
    const now = new Date();
    const timeDifference = now - surveyDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    let formattedDate;
    if (minutesDifference < 60) {
      formattedDate = `${minutesDifference} minuuttia sitten`;
    } else if (hoursDifference < 24) {
      formattedDate = `${hoursDifference} tuntia sitten`;
    } else if (daysDifference <= 14) {
      formattedDate = `${daysDifference} päivää sitten`;
    } else {
      formattedDate = `${surveyDate.toLocaleDateString()}, klo ${surveyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return (
      <View style={styles.surveyContainer}>
        <View style={styles.surveyInfo}>
          <Text style={styles.surveyTitle}>{survey.scaffold_type}: {survey.task}</Text>
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