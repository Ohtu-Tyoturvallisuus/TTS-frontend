import React, {useContext} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import WorkSafetyForm from './risk_form/WorkSafetyForm'; // Import the WorkSafetyForm component
import RiskFormButton from './risk_form/RiskFormButton';
import { WorksiteSurveyContext } from '../contexts/WorksiteSurveyContext';
import { useNavigate } from 'react-router-native';

const SurveyList = () => {
  const { selectedWorksite: worksite, setSelectedSurveyURL } = useContext(WorksiteSurveyContext);
  const navigate = useNavigate()

  const renderSurveyOption = ({ item: survey }) => (
    <View style={styles.surveyContainer}>
      <View style={styles.surveyInfo}>
        <Text style={styles.surveyTitle}>{survey.title}</Text>
        <Text style={styles.surveyDate}>{new Date(survey.created_at).toLocaleDateString()}</Text>
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

  return (
    <>
      <Text>Tehdyt kartoitukset:</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={worksite.surveys}
          renderItem={renderSurveyOption}
          keyExtractor={survey => survey.id.toString()}
        />
      </View>
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