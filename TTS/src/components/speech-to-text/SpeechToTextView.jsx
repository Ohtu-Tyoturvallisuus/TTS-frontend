import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { uploadAudio } from '@services/apiService';

import RecordingLanguageView from './RecordingLanguageView';
import TranscriptionView from './TranscriptionView';
import TranslationsView from './TranslationsView';
import RecordingControls from './RecordingControls';
import SelectTranslateLanguage from './SelectTranslateLanguage';
import { getLanguageToFlagMap } from '@utils/languageUtils';

const SpeechToTextView = ({ setDescription = null, translate = true }) => {
  const { t, i18n } = useTranslation();
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [recordingLanguage, setRecordingLanguage] = useState(i18n.language);
  const [translationLanguages, setTranslationLanguages] = useState([]);
  const [translations, setTranslations] = useState({});

  const languageToFlagMap = getLanguageToFlagMap();
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
    const result = await uploadAudio(fileUri, recordingLanguage, translationLanguages);
    if (result) {
      result.transcription && setTranscription(result.transcription);
      result.translations && setTranslations(result.translations);

      if (setDescription) {
        setDescription((prevDescription) =>
          prevDescription
            ? `${prevDescription} ${result.transcription}`
            : result.transcription
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {transcription !== '' && translate && (
        <TranscriptionView recordingLanguageFlagCode={recordingLanguageFlagCode} transcription={transcription} />
      )}
      {translate && (
        <SelectTranslateLanguage setTranslationLanguages={setTranslationLanguages} />
      )}
      {recordingLanguage !== '' && (
        <TranslationsView translations={translations} languageToFlagMap={languageToFlagMap} t={t}/>
      )}
      <RecordingControls recording={recording} startRecording={startRecording} stopRecording={stopRecording} timeout={timeout} t={t} />
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
