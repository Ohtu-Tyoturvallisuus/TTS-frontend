import React, { useContext } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';

import SurveyList from './ProjectSurveyList';
import RiskFormButton from '@components/buttons/RiskFormButton';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import CloseButton from '@components/buttons/CloseButton';

const ProjectModal = ({ visible, setVisible, onClose }) => {
  const { selectedProject: project } = useContext(ProjectSurveyContext);
  const { t } = useTranslation();

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
          <RiskFormButton title={t('projectmodal.title')} setVisible={setVisible} />
          <SurveyList setVisible={setVisible} />
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