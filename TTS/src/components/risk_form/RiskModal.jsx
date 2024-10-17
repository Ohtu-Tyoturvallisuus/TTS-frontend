import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import SpeechToTextView from '../SpeechToTextView';

const RiskModal = ({ 
  title, 
  visible, 
  onClose, 
  initialDescription, 
  onSubmit, 
  onReset, 
  isModification 
}) => {
  const [useSpeech, setUseSpeech] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [buttonHidden, setButtonHidden] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>{title}</Text>
            
            <Text style={styles.sub_title}>Syötä lisätiedot:</Text>
            <TextInput
              style={styles.input}
              placeholder="Syötä lisätietoja"
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
                <Text style={styles.buttonText}>Syötä puheella</Text>
              </TouchableOpacity>
            )}
            {useSpeech && <SpeechToTextView setDescription={setDescription} />}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Peruuta</Text>
              </TouchableOpacity>
              {isModification && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={onReset}
                >
                  <Text style={styles.resetButtonText}>Resetoi</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.button,
                  description !== '' ? styles.submitButton : styles.disabledButton
                ]}
                onPress={() => description !== '' && onSubmit(description)}
                disabled={description === ''}
              >
                <Text style={styles.buttonText}>Kunnossa</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'gray',
    flex: 1,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
    flex: 1,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    height: 100,
    marginBottom: 20,
    padding: 10,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'rgb(240, 240, 240)',
    borderRadius: 10,
    maxWidth: 400,
    padding: 20,
    width: '90%',
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
    backgroundColor: 'darkorange',
    width: 'auto',
  },
  sub_title: {
    fontSize: 16,
    marginBottom: 10,
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

export default RiskModal;