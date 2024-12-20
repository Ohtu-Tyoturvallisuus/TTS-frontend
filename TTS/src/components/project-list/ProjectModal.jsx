import React, { useContext } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import ProjectSurveyList from './ProjectSurveyList';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import CloseButton from '@components/buttons/CloseButton';
import { useFormContext } from '@contexts/FormContext';

const ProjectModal = ({ visible, onClose, navigateToRiskForm }) => {
  const { selectedProject: project, setSelectedSurveyURL } = useContext(ProjectSurveyContext);
  const { resetFormData } = useFormContext();
  const { t } = useTranslation();

  if (project) {
    console.log('ProjectModal project:', project);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {project ? (
            <>
              <Text style={styles.modalTitle}>{project.formattedName}</Text>
              <TouchableOpacity
                style={styles.newSurveyButton}
                onPress={() => {
                  setSelectedSurveyURL(null);
                  console.log('Uusi kartoitus, surveyUrl on null');
                  resetFormData();
                  navigateToRiskForm();
                }}
              >
                <Text style={styles.buttonText}>{t('projectmodal.title')}</Text>
              </TouchableOpacity>
              <ProjectSurveyList navigateToRiskForm={navigateToRiskForm}/>
            </>
          ) : (
            <Text>{t('general.loading')}</Text>
          )}
          <CloseButton onPress={onClose}/>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    borderWidth: 3,
    padding: 20,
    width: '95%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newSurveyButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#32CD32',
    borderRadius: 5,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
    padding: 10,
    width: '80%',
  }
});

export default ProjectModal;
