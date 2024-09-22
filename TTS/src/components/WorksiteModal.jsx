// WorksiteModal.jsx
import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';
import SurveyList from './SurveyList';

const WorksiteModal = ({ visible, worksite, onClose }) => {
  if (!worksite) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{worksite.name}</Text>
          <Text>Sijainti: {worksite.location}</Text>
          <SurveyList surveys={worksite.surveys} />
          <Button title="Close" onPress={onClose} />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FF8C00',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default WorksiteModal;