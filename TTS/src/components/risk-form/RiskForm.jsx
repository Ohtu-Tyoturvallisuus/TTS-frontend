import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
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

  const addNewRiskNote = (title, type) => {
    const newKey = `${title} ${Object.keys(formData).filter(key => key.startsWith(title)).length + 1}`;
    updateFormField(newKey, 'description', '');
    updateFormField(newKey, 'risk_type', type);
  };

  if (loading || error) {
    return <Loading loading={loading} error={error} title={t('riskform.loadingFormData')} />;
  }

  return (
    <View className="flex items-center justify-center">
      <ScrollView className="bg-white flex-grow p-5">
        <Text className="text-2xl font-bold pb-5 text-center">{t('riskform.title')}</Text>

        {error && <Text>{t('riskform.errorFetchingData')}</Text>}
        {/* Projektin tiedot */}
        {project ? (
          <View className="mb-5">
            <Text className="text-lg font-bold py-2">{t('riskform.projectName')}:</Text>
            <Text>{project.project_name}</Text>

            <Text className="text-lg font-bold py-2">{t('riskform.projectId')}: </Text>
            <Text>{project.project_id}</Text>
            <Text className="text-lg font-bold py-2">{t('riskform.task')}:</Text>
            <ButtonGroup 
              options={['installation', 'modification', 'dismantling']} 
              selectedValue={task}
              onChange={(value) => setTask(value)}
              renderOption={(option) => t(`riskform.${option}`)}
            />

            <Text className="text-lg font-bold py-2">{t('riskform.scaffoldType')}:</Text>
            <ButtonGroup 
              options={['workScaffold', 'nonWeatherproof', 'weatherproof']} 
              selectedValue={scaffoldType}
              onChange={(value) => setScaffoldType(value)}
              renderOption={(option) => t(`riskform.${option}`)}
            />

            <Text className="text-lg font-bold py-2">{t('riskform.taskDescription')}:</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 h-24"
              value={taskDesc}
              onChangeText={(value) => setTaskDesc(value)}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
        ) : (
          <Text>{t('riskform.noProject')}</Text>
        )}

        <Text className="border-b border-gray-300 text-xl font-bold pb-1 text-center">
          {t('riskform.scaffoldRisks')}
        </Text>
        {Object.entries(formData)
          .filter(([key, value]) => value.risk_type === 'scaffolding')
          .map(([key]) => (
            <RiskNote
              key={key}
              title={key}
              renderTitle={(key) => t(`${key}.title`, { ns: 'formFields' })}
            />
        ))}

        <TouchableOpacity 
          className="p-2 border border-green-500 rounded my-2 items-center" 
          onPress={() => addNewRiskNote(t('riskform.otherScaffolding'), 'scaffolding')}
        >
          <Text className="text-green-500 text-lg font-bold">+ {t('riskform.otherScaffolding')}</Text>
        </TouchableOpacity>

        <Text className="border-b border-gray-300 text-xl font-bold pb-1 text-center">
          {t('riskform.environmentRisks')}
        </Text>
        {Object.entries(formData)
          .filter(([key, value]) => value.risk_type === 'environment')
          .map(([key]) => (
          <RiskNote
            key={key}
            title={key}
            renderTitle={(key) => t(`${key}.title`, { ns: 'formFields' })}
          />
        ))}
        <TouchableOpacity 
          className="p-2 border border-green-500 rounded my-2 items-center" 
          onPress={() => addNewRiskNote(t('riskform.otherEnvironment'), 'environment')}
        >
          <Text className="text-green-500 text-lg font-bold">+{t('riskform.otherEnvironment')}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-green-500 p-4 rounded my-2 items-center" onPress={handleSubmit}>
          <Text className="text-white text-lg font-bold">{t('riskform.submit')}</Text>
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

export default RiskForm;
