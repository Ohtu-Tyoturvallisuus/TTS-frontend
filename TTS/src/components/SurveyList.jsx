import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import RiskList from './RiskList'; // Make sure to import the RiskList component

const SurveyList = ({ surveys }) => {
  const [expandedSurveyId, setExpandedSurveyId] = useState(null);

  const toggleRiskList = (surveyId) => {
    setExpandedSurveyId(expandedSurveyId === surveyId ? null : surveyId);
  };

  const renderSurvey = ({ item: survey }) => (
    <View style={styles.surveyContainer}>
      <View style={styles.surveyInfo}>
        <Text style={styles.surveyTitle}>{survey.title}</Text>
        <Text style={styles.surveyDate}>{new Date(survey.created_at).toLocaleDateString()}</Text>
      </View>
      <Button
        title={expandedSurveyId === survey.id ? '-' : '+'}
        onPress={() => toggleRiskList(survey.id)}
      />
      {expandedSurveyId === survey.id && <RiskList risks={survey.risk_notes} />}
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