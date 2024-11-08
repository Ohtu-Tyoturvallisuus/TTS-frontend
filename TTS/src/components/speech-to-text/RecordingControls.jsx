import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const RecordingControls = ({ recording, startRecording, stopRecording, t }) => (
  <View style={styles.buttonsContainer}>
    <TouchableOpacity
      style={[styles.recordButton, recording ? styles.stopButton : styles.startButton]}
      onPress={recording ? () => stopRecording(recording) : startRecording}
    >
      <Text style={styles.buttonText}>
        {recording ? t('speechtotext.stop') : t('speechtotext.start')}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    paddingVertical: 20,
  },
  recordButton: {
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
  startButton: {
    backgroundColor: 'green',
  },
  stopButton: {
    backgroundColor: 'red',
  },
});

export default RecordingControls;