import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import LanguageSelectMenu from './LanguageSelectMenu'
import CountryFlag from 'react-native-country-flag';


const SpeechToTextView = ({ setDescription=null }) => {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [recordingLanguage, setRecordingLanguage] = useState('')
  const [translationLanguages, setTranslationLanguages] = useState([])
  const [translations, setTranslations] = useState({})
  const timeout = 60000
  const languageToFlagMap = {
    'fi': 'FI',
    'sv': 'SE',
    'en': 'GB',
    'et': 'EE',
    'lv': 'LV',
    'pl': 'PL',
    'ru': 'RU',
  }
  const codeToNameMap = {
    'fi': 'Finnish',
    'sv': 'Swedish',
    'en': 'English',
    'et': 'Estonian',
    'lv': 'Latvian',
    'pl': 'Polish',
    'ru': 'Russian',
  }
  const recordingLanguageFlagCode = recordingLanguage.slice(-2);

  let recordingTimeout;

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
  }

  async function stopRecording(currentRecording) {
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
  }

  async function uploadToBackend(fileUri) {
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
      const response = await fetch("https://tts-app.azurewebsites.net/api/transcribe/", {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      console.log("File uploaded successfully:", result);
      setTranscription(result.transcription)
      setTranslations(result.translations)
      // Concatenate into description text
      if (setDescription) {
        setDescription((prevDescription) => `${prevDescription} ${result.transcription}`);
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  }

  return (
    <View style={styles.container}>
      <LanguageSelectMenu
        setRecordingLanguage={setRecordingLanguage}
      />
      <LanguageSelectMenu
        setTranslationLanguages={setTranslationLanguages}
      />
      {recordingLanguage !== '' && (
        <View style={styles.selectedCountriesContainer}>
          <Text style={styles.selectedCountriesLabel}>Speech recognition language:</Text>
          <View style={styles.selectedCountry}>
            <CountryFlag isoCode={recordingLanguageFlagCode} size={24} />
            <Text style={styles.countryName}>{codeToNameMap[recordingLanguage.slice(0, 2)]}</Text>
          </View>
        </View>
      )}
      {translationLanguages.length !== 0 && (
        <View style={styles.selectedCountriesContainer}>
          <Text style={styles.selectedCountriesLabel}>Translation languages:</Text>
          {translationLanguages.map((value) => {
            return (
              <View key={value} style={styles.selectedCountry}>
                <CountryFlag isoCode={languageToFlagMap[value]} size={24} />
                <Text style={styles.countryName}>{codeToNameMap[value]}</Text>
              </View>
            )
          })}
        </View>
      )}
      {recordingLanguage !== '' && (
        <View>
          <Text>Paina alla olevaa nappia nauhoittaaksesi puhetta.</Text>
          <Text>Maksimipituus puheentunnistukselle on {timeout/1000} sekuntia.</Text>
          <View style={styles.buttonsContainer}>
            <Button
              title={recording ? 'Lopeta puheentunnistus' : 'Käynnistä puheentunnistus'}
              onPress={recording ? () => stopRecording(recording) : startRecording}
            />
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
  buttonsContainer: {
    paddingVertical: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  countryName: {
    fontSize: 18,
    marginLeft: 10,
  },
  selectedCountriesContainer: {
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    width: '80%',
  },
  selectedCountriesLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedCountry: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  textContainer: {
    alignItems: 'center',
    borderColor: 'lightgray',
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