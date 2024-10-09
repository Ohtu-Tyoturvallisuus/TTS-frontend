import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RiskModal = ({ title, onSubmit, visible, onClose }) => {
  const [description, setDescription] = useState('');

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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub_title}>Lisätiedot:</Text>
          <TextInput
            style={styles.input}
            placeholder="Syötä lisätietoja"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Keskeytä" onPress={onClose} color="red" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Kunnossa" onPress={handleSubmit} color="green" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sub_title: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default RiskModal;