import React, { useState, useEffect } from 'react';
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
            />
            <TouchableOpacity
              style={[styles.button, styles.speechButton]}
              onPress={() => setUseSpeech(!useSpeech)}
            >
              <Text style={styles.buttonText}>Syötä puheena</Text>
            </TouchableOpacity>
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
              {description !== '' && (
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={() => onSubmit(description)}
                >
                  <Text style={styles.buttonText}>Kunnossa</Text>
                </TouchableOpacity>
              )}
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
    paddingVertical: 10,
    marginHorizontal: 5,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  speechButton: {
    backgroundColor: 'darkorange',
    width: '100%',
  },
  submitButton: {
    backgroundColor: 'green',
    flex: 1,
  },
  sub_title: {
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RiskModal;