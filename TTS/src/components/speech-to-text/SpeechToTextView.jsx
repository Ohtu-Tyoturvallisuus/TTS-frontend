import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LanguageSelectMenu from './LanguageSelectMenu'
import countriesData from '@lang/locales/languages.json';

const SpeechToTextView = ({ setDescription=null, translation=true}) => {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [recordingLanguage, setRecordingLanguage] = useState('')
  const [translationLanguages, setTranslationLanguages] = useState([])
  const [translations, setTranslations] = useState({})
  const { t } = useTranslation();
  const timeout = 60000
  const languageToFlagMap = countriesData.countries.reduce((map, country) => {
    map[country.value] = country.flagCode;
    return map;
  }, {});
  const recordingLanguageFlagCode = recordingLanguage.slice(-2);

  let recordingTimeout;

  const startRecording = async () => {
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

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log('Recording started');

      // Set timeout to automatically stop the recording
      recordingTimeout = setTimeout(async () => {
        await stopRecording(newRecording);
      }, timeout);

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async (currentRecording) => {
    try {
      // Clear the timeout if stopRecording is called manually before it finishes
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        recordingTimeout = null;
      }

      try {
        await currentRecording.stopAndUnloadAsync();
        const uri = currentRecording.getURI();
        setRecording(null);  // Set recording to null after stopping
        console.log('Recording stopped and stored at', uri);

        // Upload the file to the backend
        await uploadToBackend(uri);
      } catch (error) {
        console.log('Recording stopped manually before timer ran out')
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
      const token = await AsyncStorage.getItem('access_token')
      const response = await fetch("https://tts-app.azurewebsites.net/api/transcribe/", {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("File uploaded successfully:", result);
      setTranscription(result.transcription)
      setTranslations(result.translations)

      // Concatenate transcription into description
      if (setDescription) {
        // Add space if there is already text in the description
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
      <LanguageSelectMenu
        setRecordingLanguage={setRecordingLanguage}
      />
      {translation && (
        <LanguageSelectMenu
          setTranslationLanguages={setTranslationLanguages}
        />
      )}
      {recordingLanguage !== '' && (
        <View>
          <Text>({t('speechtotext.maxLength')}: {t('speechtotext.seconds', { count: timeout/1000 })}.)</Text>
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
          {transcription !== '' && (
            <View style={styles.textContainer}>
              <CountryFlag isoCode={recordingLanguageFlagCode} size={24} />
              <Text style={styles.translatedText}>{transcription}</Text>
            </View>
          )}
          {Object.entries(translations).map(([lang, text]) => {
            const flagCode = languageToFlagMap[lang] || lang.toUpperCase();
            return (
              <View style={styles.textContainer} key={lang}>
                <CountryFlag isoCode={flagCode} size={24} />
                <Text style={styles.translatedText}>{text}</Text>
              </View>
            )
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    paddingVertical: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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
  textContainer: {
    alignItems: 'center',
    borderColor: 'light#c5c6c8',
    borderWidth: 1,
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '90%',
    padding: 15,
  },
  translatedText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default SpeechToTextView;
