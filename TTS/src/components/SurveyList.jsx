import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import WorkSafetyForm from './risk_form/WorkSafetyForm'; // Import the WorkSafetyForm component

const SurveyList = ({ worksite }) => {

  const renderSurvey = ({ item: survey }) => (
    <View style={styles.surveyContainer}>
      <View style={styles.surveyInfo}>
        <Text style={styles.surveyTitle}>{survey.title}</Text>
        <Text style={styles.surveyDate}>{new Date(survey.created_at).toLocaleDateString()}</Text>
      </View>
      <WorkSafetyForm title='Käytä pohjana' worksite={worksite} surveyAPIURL={survey.url}/>
    </View>
  );

  return (
    <>
      <Text>Tehdyt kartoitukset:</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={worksite.surveys}
          renderItem={renderSurvey}
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
    flexDirection: 'column',
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
});

export default SurveyList;