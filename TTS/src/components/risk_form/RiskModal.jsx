import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import SpeechToTextView from '../SpeechToTextView';

const RiskModal = ({ title, onSubmit, visible, onClose }) => {
  const [description, setDescription] = useState('');
  const [addInformationMethod, setAddInformationMethod] = useState('');

  const handleSubmit = () => {
    onSubmit(description);
    setDescription('');
    onClose();
  };

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
            <View style={{paddingVertical: 20}}>
              <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                  <Button
                    title="Puheena"
                    onPress={() => setAddInformationMethod("Speech")}
                    color={
                      addInformationMethod === "Speech"
                        ? "darkorange"
                        : "gray"
                    }
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <Button
                    title="Kirjoittamalla"
                    onPress={() => setAddInformationMethod("Text")}
                    color={
                      addInformationMethod === "Text"
                        ? "darkorange"
                        : "gray"
                    }
                  />
                </View>
              </View>
            </View>
            {addInformationMethod === "Speech" && (
              <SpeechToTextView setDescription={setDescription} />
            )}
            {addInformationMethod === "Text" && (
              <TextInput
                style={styles.input}
                placeholder="Syötä lisätietoja"
                value={description}
                onChangeText={setDescription}
              />
            )}
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Button title="Keskeytä" onPress={onClose} color="red" />
              </View>
              {description !== '' && (
                <View style={styles.buttonWrapper}>
                  <Button title="Kunnossa" onPress={handleSubmit} color="green" />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
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