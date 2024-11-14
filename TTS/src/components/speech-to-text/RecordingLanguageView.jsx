import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountryFlag from '@components/CountryFlag';

const RecordingLanguageView = ({ recordingLanguageFlagCode, t }) => (
  <View style={styles.recordingContainer}>
    <Text>{t('speechtotext.recognitionLanguage')}</Text>
    <View style={{ marginLeft: 10 }}>
      <CountryFlag isoCode={recordingLanguageFlagCode} size={24} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  recordingContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderColor: '#c5c6c8',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 5,
    padding: 5,
    width: '65%',
  },
});

export default RecordingLanguageView;