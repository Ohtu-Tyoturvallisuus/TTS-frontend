import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountryFlag from 'react-native-country-flag';

const TranscriptionView = ({ recordingLanguageFlagCode, transcription }) => (
  <View style={styles.textContainer}>
    <CountryFlag isoCode={recordingLanguageFlagCode} size={24} />
    <Text style={styles.translatedText}>{transcription}</Text>
  </View>
);

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderColor: 'light#c5c6c8',
    borderWidth: 1,
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginVertical: 3,
    maxWidth: '90%',
    padding: 15,
  },
  translatedText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default TranscriptionView;