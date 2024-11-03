import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '@contexts/FormContext';
import CustomModal from '@components/CustomModal';
import SpeechToTextView from '@components/speech-to-text/SpeechToTextView';
import TakePictureView from '@components/take-picture/TakePictureView';

const RiskEditModal = ({ 
  title,
  renderTitle,
  visible,
  onTranslate, 
  onReset,
  onClose
}) => {
  const { updateFormField, getFormData } = useFormContext();
  const [description, setDescription] = useState(getFormData(title, 'description'));
  const [useSpeech, setUseSpeech] = useState(false);
  const [buttonHidden, setButtonHidden] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = () => {
    updateFormField(title, 'description', description);
    onTranslate();
    onClose();
  };

  const handleReset = () => {
    setDescription('');
    onReset();
  }


  return (
    <CustomModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <ScrollView>
        <Text style={styles.title}>{renderTitle ? renderTitle(title) : title}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('riskmodal.extraInfo')}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          textAlignVertical="top"
        />

        {!buttonHidden && (
          <TouchableOpacity
            style={[styles.button, styles.speechButton]}
            onPress={() => {
              setUseSpeech(!useSpeech);
              setButtonHidden(true);
            }}
          >
            <Text style={styles.buttonText}>{t('riskmodal.withSpeech')}</Text>
          </TouchableOpacity>
        )}
        {useSpeech && (
          <SpeechToTextView
            setDescription={setDescription}
            translate={false}
          />
        )}

      <TakePictureView title={title}/>
        
      </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>{t('riskmodal.cancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>{t('riskmodal.reset')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              description !== ''
                ? styles.submitButton
                : styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={description === ''}
          >
            <Text style={styles.buttonText}>{'Käännä (esikatselu)'}</Text>
          </TouchableOpacity>
        </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    marginHorizontal: 5,
    marginTop: 10,
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6f7072',
    flex: 1,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
    flex: 1,
  },
  input: {
    borderColor: '#c5c6c8',
    borderWidth: 1,
    flex: 1,
    height: 100,
    padding: 10,
  },
  resetButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 10,
    width: 100,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  speechButton: {
    backgroundColor: '#ef7d00',
    width: 'auto',
  },
  submitButton: {
    backgroundColor: 'green',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RiskEditModal;