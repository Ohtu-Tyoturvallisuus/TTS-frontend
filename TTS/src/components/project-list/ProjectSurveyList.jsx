import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import useFetchSurveys from '@hooks/useFetchSurveys';
import Loading from '@components/Loading';

export const ProjectSurveyListContainer = ({ surveys = [], setSelectedSurveyURL, navigate }) => {
  const { t } = useTranslation();

  const renderSurveyOption = ({ item: survey }) => {
    const surveyDate = new Date(survey.created_at);
    const now = new Date();
    const timeDifference = now - surveyDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    let formattedDate;
    if (minutesDifference < 60) {
      formattedDate = `${t('projectsurveylistcontainer.minutesAgo', { count: minutesDifference })}`;
    } else if (hoursDifference < 24) {
      formattedDate = `${t('projectsurveylistcontainer.hoursAgo', { count: hoursDifference })}`;
    } else if (daysDifference <= 14) {
      formattedDate = `${t('projectsurveylistcontainer.daysAgo', { count: daysDifference })}`;
    } else {
      formattedDate = `${surveyDate.toLocaleDateString()}, klo ${
        surveyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }`;
    }

    const handleSurveyPress = (survey) => {
      console.log('Valittu kartoitus:', survey);
      setSelectedSurveyURL(survey.url);
      navigate('RiskForm');
    };

    return (
      <View style={styles.surveyContainer}>
        <View style={styles.surveyInfo}>
          <Text style={styles.surveyTitle}>{`${t(`riskform.${survey.scaffold_type}`)}: ${t(`riskform.${survey.task}`)}`}</Text>
          <Text style={styles.surveyDate}>{formattedDate}</Text>
        </View>
        <View>
          <TouchableOpacity
            testID={`use-survey-${survey.id}`}
            style={styles.button}
            onPress={() => handleSurveyPress(survey)}
          >
            <Text style={styles.buttonText}>{t('projectsurveylistcontainer.useTemplate')}</Text>
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
          <Text style={styles.noSurveysText}>{t('projectsurveylistcontainer.noSurveys')}</Text>
        </View>
      )}
    </>
  );
};

const ProjectSurveyList = ({ setVisible }) => {
  const {selectedProject: project, setSelectedSurveyURL } = useContext(ProjectSurveyContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { surveys, loading, error } = useFetchSurveys(project.id);

  if (loading || error) {
    return (
        <Loading 
          loading={loading} 
          error={error}
          title={t('projectsurveylist.loadingSurveys')}
        />
    );
  }

  return (
    <ProjectSurveyListContainer 
      surveys={surveys} 
      setSelectedSurveyURL={setSelectedSurveyURL} 
      navigate={navigation.navigate} 
      setVisible={setVisible} 
    />
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
    width: '100%',
  },
  surveyDate: {
    color: '#555',
    fontSize: 12,
  },
  surveyInfo: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  surveyTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
});

export default ProjectSurveyList;