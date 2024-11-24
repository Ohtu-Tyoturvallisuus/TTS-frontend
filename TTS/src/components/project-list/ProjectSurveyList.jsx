import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import useFetchSurveys from '@hooks/useFetchSurveys';
import Loading from '@components/Loading';
import { formatRelativeDate } from '@utils/dateUtils';

export const ProjectSurveyListContainer = ({ surveys = [], setSelectedSurveyURL, navigateToRiskForm }) => {
  const { t } = useTranslation();

  const renderSurveyOption = ({ item: survey }) => {
    const formattedDate = formatRelativeDate(survey.created_at, t);
    
    const handleSurveyPress = (survey) => {
      console.log('Valittu kartoitus:', survey);
      setSelectedSurveyURL(survey.url);
      navigateToRiskForm();
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

const ProjectSurveyList = ({ navigateToRiskForm }) => {
  const {selectedProject: project, setSelectedSurveyURL } = useContext(ProjectSurveyContext);
  const { t } = useTranslation();
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
      navigateToRiskForm={navigateToRiskForm} 
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