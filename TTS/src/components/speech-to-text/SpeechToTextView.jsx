import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RecordingLanguageView from './RecordingLanguageView';
import TranscriptionView from './TranscriptionView';
import TranslationsView from './TranslationsView';
import RecordingControls from './RecordingControls';
import SelectTranslateLanguage from './SelectTranslateLanguage';
import countriesData from '@lang/locales/languages.json';

const SpeechToTextView = ({ setDescription = null, translate = true }) => {
  const { t, i18n } = useTranslation();
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [recordingLanguage, setRecordingLanguage] = useState(i18n.language);
  const [translationLanguages, setTranslationLanguages] = useState([]);
  const [translations, setTranslations] = useState({});

  const languageToFlagMap = countriesData.countries.reduce((map, country) => {
    map[country.value] = country.flagCode;
    return map;
  }, {});
  const recordingLanguageFlagCode = recordingLanguage.slice(-2);
  const timeout = 60000;
  let recordingTimeout;

  useEffect(() => {
    setRecordingLanguage(i18n.language);
  }, [i18n.language]);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access audio was denied');
        return;
      }

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log('Recording started');

      recordingTimeout = setTimeout(async () => {
        await stopRecording(newRecording);
      }, timeout);

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async (currentRecording) => {
    try {
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        recordingTimeout = null;
      }

      try {
        await currentRecording.stopAndUnloadAsync();
        const uri = currentRecording.getURI();
        setRecording(null);
        console.log('Recording stopped and stored at', uri);

        await uploadToBackend(uri);
      } catch (error) {
        console.log('Recording stopped manually before timer ran out');
      }

    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const uploadToBackend = async (fileUri) => {
    let formData = new FormData();
    const fileType = "audio/3gp";

    formData.append('audio', {
      uri: fileUri,
      name: 'audio.3gp',
      type: fileType
    });

    formData.append('recordingLanguage', recordingLanguage);
    formData.append('translationLanguages', JSON.stringify(translationLanguages));

    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch("https://tts-app.azurewebsites.net/api/transcribe/", {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.error) {
        if (result.error === "Invalid or expired token") {
          console.error("Invalid or expired token. Please log in again.");
        } else {
          console.error("Error from server:", result.error);
        }
        return;
      }
      console.log("File uploaded successfully:", result);
      result.transcription && setTranscription(result.transcription);
      result.translations && setTranslations(result.translations);

      if (setDescription) {
        setDescription((prevDescription) =>
          prevDescription
            ? `${prevDescription} ${result.transcription}`
            : result.transcription
        );
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  return (
    <View style={styles.container}>
      <RecordingLanguageView recordingLanguageFlagCode={recordingLanguageFlagCode} t={t} />
      {transcription !== '' && translate && (
        <TranscriptionView recordingLanguageFlagCode={recordingLanguageFlagCode} transcription={transcription} />
      )}
      {translate && (
        <SelectTranslateLanguage setTranslationLanguages={setTranslationLanguages} />
      )}
      {recordingLanguage !== '' && (
        <TranslationsView translations={translations} languageToFlagMap={languageToFlagMap} t={t} timeout={timeout} />
      )}
      <RecordingControls recording={recording} startRecording={startRecording} stopRecording={stopRecording} t={t} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpeechToTextView;