import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';
import SurveyList from './SurveyList';
import RiskFormButton from './risk_form/RiskFormButton';
import { useContext } from 'react';
import { ProjectSurveyContext } from '../contexts/ProjectSurveyContext';

const ProjectModal = ({ visible, onClose }) => {
  const { selectedProject: project } = useContext(ProjectSurveyContext);

  if (!project) {
    console.log('Projektia ei ole saatavilla');
    return null;
  }
  console.log('Projektin tiedot:', project);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{project.formattedName}</Text>
          <RiskFormButton title='Täytä uusi riskilomake'/>
          <SurveyList/>
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
    width: '95%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FF8C00',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProjectModal;