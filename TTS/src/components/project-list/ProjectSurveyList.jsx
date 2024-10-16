import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-native';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import useFetchSurveys from '@hooks/useFetchSurveys';
import Loading from '@components/Loading';

export const ProjectSurveyListContainer = ({ surveys = [], setSelectedSurveyURL, navigate }) => {
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
      formattedDate = `${surveyDate.toLocaleDateString()}, klo ${
        surveyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }`;
    }

    const handleSurveyPress = (survey) => {
      console.log('Valittu kartoitus:', survey);
      setSelectedSurveyURL(survey.url);
      navigate('worksafetyform');
    };

    return (
      <View style={styles.surveyContainer}>
        <View style={styles.surveyInfo}>
          <Text style={styles.surveyTitle}>{survey.scaffold_type}: {survey.task}</Text>
          <Text style={styles.surveyDate}>{formattedDate}</Text>
        </View>
        <View>
          <TouchableOpacity
            testID={`use-survey-${survey.id}`}
            style={styles.button}
            onPress={() => handleSurveyPress(survey)}
          >
            <Text style={styles.buttonText}>Käytä pohjana</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {surveys.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={surveys}
            renderItem={renderSurveyOption}
            keyExtractor={survey => survey.id.toString()}
          />
        </View>
      ) : (
        <View style={styles.noSurveysContainer}>
          <Text style={styles.noSurveysText}>Ei kartoituksia saatavilla.</Text>
        </View>
      )}
    </>
  );
};

const ProjectSurveyList = () => {
  const {selectedProject: project, setSelectedSurveyURL } = useContext(ProjectSurveyContext);
  const { surveys = [], loading, error } = useFetchSurveys(project.id);
  const navigate = useNavigate();

  if (loading || error) {
    return (
        <Loading 
          loading={loading} 
          error={error} 
        />
    );
  }

  return (
    <ProjectSurveyListContainer surveys={surveys} setSelectedSurveyURL={setSelectedSurveyURL} navigate={navigate} />
  );
}

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
    maxHeight: 350, 
  },
  noSurveysContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  noSurveysText: {
    color: '#555',
    fontSize: 16,
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
    paddingVertical: 5,
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

export default ProjectSurveyList;