import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const RecordingControls = ({ recording, startRecording, stopRecording, isLoading, t }) => (
  <View style={styles.container}>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef7d00"  />
      </View>
    ) : (
      <TouchableOpacity
        style={[styles.recordButton, recording ? styles.stopButton : styles.startButton]}
        onPress={recording ? () => stopRecording(recording) : startRecording}
      >
        <Text style={styles.buttonText}>
          {recording ? t('speechtotext.stop') : t('speechtotext.start')}
        </Text>
        <MaterialCommunityIcons name="text-to-speech" size={24} color="white" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    minHeight: 48,
    padding: 10,
  },
  startButton: {
    backgroundColor: 'green',
  },
  stopButton: {
    backgroundColor: 'red',
    paddingHorizontal: 35,
  },
});

export default RecordingControls;
