import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { submitForm } from '@services/formSubmission';
import useFetchSurveyData from '@hooks/useFetchSurveyData';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import { useFormContext } from '@contexts/FormContext';
import { useTranslationLanguages } from '@contexts/TranslationContext';
import { UserContext } from '@contexts/UserContext';
import { NavigationContext } from '@contexts/NavigationContext';
import RiskNote from './RiskNote';
import CloseButton from '@components/buttons/CloseButton';
import SuccessAlert from '@components/SuccessAlert';
import Loading from '@components/Loading';
import ConfirmationModal from '@components/ConfirmationModal';
import FilledRiskForm from './FilledRiskForm';
import TaskInfo from './TaskInfo';

const RiskForm = () => {
  const {
    selectedProject: project,
    selectedSurveyURL: surveyURL,
    setSelectedSurveyId,
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
    setAccessCode
  } = useFormContext();

  const { setCurrentLocation } = useContext(NavigationContext);
  const { newUserSurveys, setNewUserSurveys } = useContext(UserContext);

  const navigation = useNavigation();
  const { t } = useTranslation(['translation', 'formFields']);
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

  const handleSubmit = async () => {
    const taskInfo = {
      task: task,
      description: taskDesc,
      scaffold_type: scaffoldType,
    };
    console.log('Submitting:', taskInfo);
    try {
      setSubmitted(true)
      const response = await submitForm(project, taskInfo, formData, t);
      setAccessCode(response.access_code);
      setSelectedSurveyId(response.id);
      response._j && setSubmitted(false);

      navigation.navigate('FormValidationView');
      setNewUserSurveys(!newUserSurveys);
      setCurrentLocation('FormValidationView');
    } catch (error) {
      console.log('Could not submit form', error);
      setSubmitted(false);
    }
  };

  const handleClose = () => {
    allowNavigationRef.current = true;
    resetProjectAndSurvey();
    setShowExitModal(false);

    // if (submitted) {
    //   Alert.alert(
    //     `${t('riskform.formCode')}: ${accessCode}`,
    //     t('riskform.findFormInfo')
    //   )
    // }
    setSubmitted(false);
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
    <View className="flex items-center justify-center flex-1">
      {submitted ? (
        <>
          <ActivityIndicator size='large' color='#EF7D00' />
          <Text className="text-2xl font-medium mt-6 text-center">
            {t('riskform.submitting')}
          </Text>
        </>
      ) : (
        <ScrollView
          className="bg-white flex-grow p-5 w-full h-full"
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Image
            source={require('../../../assets/telinekataja.png')}
            style={{ width: '100%', height: 150, resizeMode: 'contain' }}
          />
          <Text className="text-2xl font-bold pb-5 text-center">{t('riskform.title')}</Text>
          {error && <Text>{t('riskform.errorFetchingData')}</Text>}
          {/* Projektin tiedot */}
          {project ? (
              <TaskInfo
                project={project}
                setToLangs={setToLangs}
              />
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
            className="p-2 border border-green-500 rounded my-2 min-h-12 items-center"
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
            className="p-2 border border-green-500 rounded my-2 min-h-12 items-center"
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
        </ScrollView>
      )}
      <ConfirmationModal
        visible={showExitModal}
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          handleClose();
          navigation.navigate('ProjectList');
          setNewUserSurveys(!newUserSurveys);
          setCurrentLocation('ProjectList');
        }}
      />
    </View>
  );
};

export default RiskForm;
