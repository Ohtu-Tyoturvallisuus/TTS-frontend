import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import RiskNote from './RiskNote';
import ButtonGroup from '@components/buttons/ButtonGroup';
import CloseButton from '@components/buttons/CloseButton';
import { submitForm } from '@services/formSubmission';
import SuccessAlert from '@components/SuccessAlert';
import { useFormContext } from '@contexts/FormContext';
import { useTranslationLanguages } from '@contexts/TranslationContext';
import useFetchSurveyData from '@hooks/useFetchSurveyData';
import Loading from '@components/Loading';
import ConfirmationModal from '@components/ConfirmationModal';
import SpeechToTextView from '@components/speech-to-text/SpeechToTextView';
import FilledRiskForm from './FilledRiskForm';
import SelectTranslateLanguage from '@components/speech-to-text/SelectTranslateLanguage';

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

  const navigation = useNavigation();
  const { t } = useTranslation(['translation', 'formFields']);
  const [ showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [ showExitModal, setShowExitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const allowNavigationRef = useRef(false);
  const { setToLangs } = useTranslationLanguages();

  const { surveyData, loading, error } = useFetchSurveyData(surveyURL);

  // Merges previous survey's data to the form if surveyData is available
  useEffect(() => {    
    if (surveyData) {
      const currentNotes = surveyData.risk_notes.reduce((acc, note) => {
        acc[note.note] = {
          description: note.description,
          status: note.status,
          risk_type: note.risk_type,
          images: [],
        };
        return acc;
      }, {});

      if (JSON.stringify(formData) !== JSON.stringify(currentNotes)) {
        console.log("Merging prev survey's data");
        replaceFormData(currentNotes);
      }
  
      setTask(surveyData.task);
      setScaffoldType(surveyData.scaffold_type);
      setTaskDesc(surveyData.description);
    }
  }, [surveyData]);

  // Displays confirmation modal when user tries to leave the form
  useEffect(() => {
    console.log('RiskForm useEffect');
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!allowNavigationRef.current) {
        e.preventDefault();
        setShowExitModal(true);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleSubmit = () => {
    const taskInfo = {
      task: task,
      description: taskDesc,
      scaffold_type: scaffoldType,
    };
    console.log('Submitting:', taskInfo);
    console.log('FORMDATA:', formData);
    try {
      setSubmitted(true)
      const response = submitForm(project, taskInfo, formData, setShowSuccessAlert, t);
      response._j && setSubmitted(false);
      console.log('RESPONSE:', response);
    } catch (error) {
      console.log('Could not submit form', error);
      setSubmitted(false);
    }
  };

  const handleClose = () => {
    allowNavigationRef.current = true;
    resetProjectAndSurvey();
    setShowSuccessAlert(false);
    setShowExitModal(false);
    navigation.navigate('ProjectList');
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
      <ScrollView 
        className="bg-white flex-grow p-5 w-full h-full" 
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Image
          source={require('../../../assets/telinekataja.png')}
          style={{ width: '100%', height: 150, resizeMode: 'contain' }}
        />
        {!submitted ? (
          <>
            <Text className="text-2xl font-bold pb-5 text-center">{t('riskform.title')}</Text>
          
            {error && <Text>{t('riskform.errorFetchingData')}</Text>}
            {/* Projektin tiedot */}
            {project ? (
              <View className="mb-3">
            <SelectTranslateLanguage setTranslationLanguages={setToLangs} />

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
                  testID='taskDesc'
                  className="border border-gray-300 rounded p-2 h-24"
                  value={taskDesc}
                  onChangeText={(value) => setTaskDesc(value)}
                  multiline={true}
                  textAlignVertical="top"
                />
                <SpeechToTextView
                  setDescription={setTaskDesc}
                  translate={false}
                />
              </View>
            ) : (
              <Text>{t('riskform.noProject')}</Text>
            )}
  
            <Text className="border-b border-gray-300 text-xl font-bold pb-1 text-center">
              {t('riskform.scaffoldRisks')}
            </Text>
            {Object.entries(formData)
              .filter(([, value]) => value.risk_type === 'scaffolding')
              .map(([key]) =>
                key.startsWith('riskform.otherScaffolding') ? (
                  <RiskNote
                    key={key}
                    title={key}
                    renderTitle={() => `${t(`${key.split(' ')[0]}`)} ${key.split(' ')[1]}`}
                  />
                ) : (
                  <RiskNote
                    key={key}
                    title={key}
                    renderTitle={() => t(`${key}.title`, { ns: 'formFields' })}
                  />
                )
              )
            }
  
          
            <TouchableOpacity 
              className="p-2 border border-green-500 rounded my-2 items-center" 
              onPress={() => addNewRiskNote('riskform.otherScaffolding', 'scaffolding')}
            >
              <Text className="text-green-500 text-lg font-bold">+ {t('riskform.otherScaffolding')}</Text>
            </TouchableOpacity>
          
            <Text className="border-b border-gray-300 text-xl font-bold pb-1 text-center mt-5">
              {t('riskform.environmentRisks')}
            </Text>
            {Object.entries(formData)
              .filter(([, value]) => value.risk_type === 'environment')
              .map(([key]) => 
                key.startsWith('riskform.otherEnvironment') ? (
                  <RiskNote
                    key={key}
                    title={key}
                    renderTitle={() => `${t(`${key.split(' ')[0]}`)} ${key.split(' ')[1]}`}
                  />
                ) : (
                  <RiskNote
                    key={key}
                    title={key}
                    renderTitle={(key) => t(`${key}.title`, { ns: 'formFields' })}
                  />
                )
              )
            }
            <TouchableOpacity 
              className="p-2 border border-green-500 rounded my-2 items-center" 
              onPress={() => addNewRiskNote('riskform.otherEnvironment', 'environment')}
            >
              <Text className="text-green-500 text-lg font-bold">+ {t('riskform.otherEnvironment')}</Text>
            </TouchableOpacity>
          
            {project && (
              <>
                <FilledRiskForm
                  formData={formData}
                  handleSubmit={handleSubmit}
                  projectName={project.project_name}
                  projectId={project.project_id}
                  task={task}
                  scaffoldType={scaffoldType}
                  taskDesc={taskDesc}
                />
                <CloseButton onPress={() => setShowExitModal(true)} />
              </>
            )}
          </>
        ) : (
          <>
            <ActivityIndicator size='large' color='#EF7D00' />
            <Text className="self-center">{t('riskform.submitting')}</Text>
          </>
        )}
      </ScrollView>
      {showSuccessAlert && (
        <SuccessAlert 
          message={t('riskform.successMessage')} 
          onDismiss={handleClose} 
        />
      )}
      <ConfirmationModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={handleClose}
      />
    </View>
  );
};

export default RiskForm;
