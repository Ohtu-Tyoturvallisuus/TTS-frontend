import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import WorkSafetyForm from './risk_form/WorkSafetyForm'; // Import the WorkSafetyForm component

const SurveyList = ({ surveys }) => {
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  const toggleWorkSafetyForm = (surveyId) => {
    setSelectedSurveyId(selectedSurveyId === surveyId ? null : surveyId);
  };

  const renderSurvey = ({ item: survey }) => (
    <View style={styles.surveyContainer}>
      <View style={styles.surveyInfo}>
        <Text style={styles.surveyTitle}>{survey.title}</Text>
        <Text style={styles.surveyDate}>{new Date(survey.created_at).toLocaleDateString()}</Text>
      </View>
      <Button
        title={'Aloita riskikartoitus'}
        onPress={() => toggleWorkSafetyForm(survey.id)}
      />
      {selectedSurveyId === survey.id && <WorkSafetyForm />}
    </View>
  );

  return (
    <FlatList
      data={surveys}
      renderItem={renderSurvey}
      keyExtractor={survey => survey.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  surveyContainer: {
    flexDirection: 'column',
    padding: 10,
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
});

export default SurveyList;