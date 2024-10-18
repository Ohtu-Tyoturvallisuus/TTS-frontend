import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import SurveyList from './ProjectSurveyList';
import RiskFormButton from '@components/buttons/RiskFormButton';
import { useContext } from 'react';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import CloseButton from '@components/buttons/CloseButton';

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
          <CloseButton onPress={onClose}/>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#FF8C00',
    borderRadius: 10,
    borderWidth: 5,
    padding: 20,
    width: '95%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProjectModal;