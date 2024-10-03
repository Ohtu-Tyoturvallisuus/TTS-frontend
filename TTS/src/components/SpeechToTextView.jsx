import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';


const SpeechToTextView = () => {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const local_ip = Constants.expoConfig.extra.local_ip;

  async function startRecording() {
    try {
      // Set the audio mode for recording on iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access audio was denied');
        return;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        console.log('Recording stopped and stored at', uri);

        // Upload the file to the Django backend
        await uploadToBackend(uri);
    } catch (error) {
        console.error('Failed to stop recording', error);
    }
  }

  async function uploadToBackend(fileUri) {
    let formData = new FormData();
    const fileType = "audio/3gp";

    formData.append('audio', {
        uri: fileUri,
        name: 'audio.3gp',
        type: fileType
    });

    try {
        const response = await fetch("http://" + local_ip + ":8000/api/transcribe/", {
            method: "POST",
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const result = await response.json();
        console.log("File uploaded successfully:", result);
        setTranscription(result.transcription)
    } catch (error) {
        console.error("Failed to upload file:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Paina alla olevaa nappia kääntääksesi puhetta</Text>
      <View style={styles.buttonsContainer}>
        <Button title={recording ? 'Lopeta puheentunnistus' : 'Käynnistä puheentunnistus'} onPress={recording ? stopRecording : startRecording} />
      </View>
      {transcription !== '' && (
        <View style={styles.transcriptionContainer}>
          <Text>Käännös:</Text>
          <Text>{transcription}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonsContainer: {
    paddingVertical: 20,
  },
  transcriptionContainer: {
    paddingTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
});

export default SpeechToTextView;