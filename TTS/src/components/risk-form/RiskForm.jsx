import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useTranslation } from 'react-i18next';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import RiskNote from './RiskNote';
import ButtonGroup from '@components/buttons/ButtonGroup';
import CloseButton from '@components/buttons/CloseButton';
import { submitForm } from '@services/formSubmission';
import SuccessAlert from '@components/SuccessAlert';
import { useFormContext } from '@contexts/FormContext';
import useFetchSurveyData from '@hooks/useFetchSurveyData';
import Loading from '@components/Loading';

const RiskForm = () => {
  const { 
    selectedProject: project, 
    selectedSurveyURL: surveyURL,
    resetProjectAndSurvey,
  } = useContext(ProjectSurveyContext);

  const { 
    formData, 
    updateFormField, 
    replaceFormData,
    task, 
    setTask, 
    scaffoldType, 
    setScaffoldType, 
    taskDesc, 
    setTaskDesc, 
  } = useFormContext();

  const navigate = useNavigate();
  const { t } = useTranslation(['translation', 'formFields']);
  const [ showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { surveyData, loading, error } = useFetchSurveyData(surveyURL);

  useEffect(() => {
    if (surveyData) {
      console.log("Merging prev survey's data")
      replaceFormData(surveyData.risk_notes.reduce((acc, note) => {
        acc[note.note] = {
          description: note.description,
          status: note.status,
          risk_type: note.risk_type,
          images: note.images,
        };
        return acc;
      }, {}));
      
      setTask(surveyData.task);
      setScaffoldType(surveyData.scaffold_type);
      setTaskDesc(surveyData.description);
    }
  }, [surveyData]);

  const handleSubmit = () => {
    const taskInfo = {
      task: task,
      description: taskDesc,
      scaffold_type: scaffoldType,
    };
    submitForm(project, taskInfo, formData, setShowSuccessAlert, t);
  };

  const handleClose = () => {
    resetProjectAndSurvey();
    setShowSuccessAlert(false);
    navigate('/');
  };

  if (loading || error) {
    return <Loading loading={loading} error={error} title={t('riskform.loadingFormData')} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{t('riskform.title')}</Text>

        {error && <Text>{t('riskform.errorFetchingData')}</Text>}
        {/* Projektin tiedot */}
        {project ? (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>{t('riskform.projectName')}:</Text>
            <Text>{project.project_name}</Text>

            <Text style={styles.label}>{t('riskform.projectId')}: </Text>
            <Text>{project.project_id}</Text>
            <Text style={styles.label}>{t('riskform.task')}:</Text>
            <ButtonGroup 
              options={['installation', 'modification', 'dismantling']} 
              selectedValue={task}
              onChange={(value) => setTask(value)}
              renderOption={(option) => t(`riskform.${option}`)}
            />

            <Text style={styles.label}>{t('riskform.scaffoldType')}:</Text>
            <ButtonGroup 
              options={['workScaffold', 'nonWeatherproof', 'weatherproof']} 
              selectedValue={scaffoldType}
              onChange={(value) => setScaffoldType(value)}
              renderOption={(option) => t(`riskform.${option}`)}
            />

            <Text style={styles.label}>{t('riskform.taskDescription')}:</Text>
            <TextInput
              style={styles.input}
              value={taskDesc}
              onChangeText={(value) => setTaskDesc(value)}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
        ) : (
          <Text>{t('riskform.noProject')}</Text>
        )}

        <Text style={styles.sectionTitle}>{t('riskform.scaffoldRisks')}</Text>
        {Object.entries(formData)
          .filter(([key, value]) => value.risk_type === 'scaffolding' && !key.startsWith('other_scaffolding'))
          .map(([key]) => (
            <RiskNote
              key={key}
              title={key}
              renderTitle={(key) => t(`${key}.title`, { ns: 'formFields' })}
            />
        ))}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('other_scaffolding.title', { ns: 'formFields' })}:</Text>
          <TextInput
            style={styles.input}
            value={formData['other_scaffolding']?.description}
            onChangeText={(value) => updateFormField('other_scaffolding', 'description', value)}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.sectionTitle}>{t('riskform.environmentRisks')}</Text>
        {Object.entries(formData)
          .filter(([key, value]) => value.risk_type === 'environment' && !key.startsWith('other_environment.title'))
          .map(([key]) => (
          <RiskNote
            key={key}
            title={key}
            renderTitle={(key) => t(`${key}.title`, { ns: 'formFields' })}
          />
        ))}

        <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('other_environment.title', { ns: 'formFields' })}:</Text>
        <TextInput
          style={styles.input}
          value={formData['other_environment']?.description}
          onChangeText={(value) => updateFormField('other_environment', 'description', value)}
          multiline={true}
          textAlignVertical="top"
        />
        </View>

        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t('riskform.submit')}</Text>
        </TouchableOpacity>

        <CloseButton onPress={handleClose} />
      </ScrollView>
      {showSuccessAlert && (
        <SuccessAlert 
          message={t('riskform.successMessage')} 
          onDismiss={handleClose} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    marginVertical: 10,
    padding: 15,
  },
    buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
    container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
    infoContainer: {
    marginBottom: 20,
  },
    input: {
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    height: 100,
    padding: 10,
  },
    inputContainer: {
    marginBottom: 20,
  },
    label: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
    scrollContainer: {
    backgroundColor: '#fff',
    flexGrow: 1,
    padding: 20,
  },
    sectionTitle: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 5,
    textAlign: 'center',
  },
    submitButton: {
    backgroundColor: 'green',
  },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center',
  },
});

export default RiskForm;
