import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import useMergedSurveyData from '@hooks/useMergedSurveyData';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import { postNewSurvey, postRiskNotes } from '@services/apiService';
import RiskNote from './RiskNote';
import ButtonGroup from '@components/buttons/ButtonGroup';
import CloseButton from '@components/buttons/CloseButton';
import SuccessAlert from '@components/SuccessAlert';
import useFormFields from '@hooks/useFormFields';

const RiskForm = () => {
  const { 
    selectedProject: project, 
    setSelectedProject, 
    selectedSurveyURL: prevSurveyURL, 
    setSelectedSurveyURL 
  } = useContext(ProjectSurveyContext);
  const navigation = useNavigation();
  const { t } = useTranslation(['translation', 'formFields']);
  const [ task, setTask ] = useState('');
  const [ scaffoldType, setScaffoldType ] = useState('');
  const [ taskDesc, setTaskDesc ] = useState('');
  const [ showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { initialFormData } = useFormFields();
  const [ formData, setFormData ] = useState(initialFormData);
  // Fetch and merge survey data if prevSurveyURL is defined
  const { mergedFormData, taskDetails, error, isMerged } = useMergedSurveyData(prevSurveyURL, initialFormData);

  useEffect(() => {
    if (isMerged) {
      const { task, scaffoldType, taskDesc } = taskDetails;
      setTask(task);
      setScaffoldType(scaffoldType);
      setTaskDesc(taskDesc);
      setFormData(mergedFormData);
    }
  }, [isMerged]);

  if (error) {
    alert(t('riskform.errorFetchingData'));
  }
  const handleInputChange = (title, field, value) => {
    setFormData(prevFormData => {
      console.log('Changed', title, field, 'to', value);
      return {
        ...prevFormData,
        [title]: {
          ...prevFormData[title],
          [field]: value || '', // Set value to empty string if it's undefined/null
        },
      };
    });
  };

  const validateFields = (fields) => {
    const validatedFields = {};
    Object.keys(fields).forEach(key => {
      validatedFields[key] = fields[key] ?? "";  // Replace null/undefined with an empty string
    });
    return validatedFields;
  };

  const handleSubmit = () => {
  // ------------------------------------------------
  // TODO: Implement form submit checks
  // ------------------------------------------------
    const taskInfo = {
      task: task,
      description: taskDesc,
      scaffold_type: scaffoldType,
    };
    const validatedSurveyData = validateFields(taskInfo);
    
    // POST a new survey instance
    postNewSurvey(project.id, validatedSurveyData.description, validatedSurveyData.task, validatedSurveyData.scaffold_type)
    .then(response => {
      console.log('Server response:', response);
      const surveyId = response.id;

      // Formatting formData as list of django risk_note instances
      const riskNotes = Object.keys(formData).map(key => {
        const { description, status } = formData[key]; // Retrieve description and status
        const risk_type = formData[key].risk_type; // Keep the existing risk type

        // Return a new object with only the necessary fields
        return {
          note: key, // Use the translation key
          description: description || '', // Use existing description or empty string
          status: status || '', // Use existing status or empty string
          risk_type: risk_type // Use existing risk type
        };
      });

      // POST risk notes to the just made survey
      return postRiskNotes(surveyId, riskNotes);
    })
    .then(() => {
      setShowSuccessAlert(true);
    })
    .catch(error => {
      console.error('Error during form submission:', error);
      alert(t('riskform.errorSubmitting'));
    });
  };

  const handleClose = () => {
    setSelectedProject(null);
    setSelectedSurveyURL(null);
    setShowSuccessAlert(false);
    navigation.navigate('ProjectList');
  };

  if (!formData || !Object.keys(formData).length) {
    return <Text>{t('riskform.loadingFormData')}</Text>;
  }

  return (
    <SafeAreaView>
      <View className="flex-1 items-center justify-center">
        <ScrollView className="bg-white flex-grow p-5">
          <Text className="text-2xl font-bold text-center pb-5">{t('riskform.title')}</Text>

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
                className="border border-dark-green rounded-md p-2 h-24"
                value={taskDesc}
                onChangeText={(value) => setTaskDesc(value)}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
          ) : (
            <Text>{t('riskform.noProject')}</Text>
          )}

          <Text className="text-xl font-bold text-center border-b pb-2">{t('riskform.scaffoldRisks')}</Text>
          {Object.entries(formData)
            .filter(([key, value]) => value.risk_type === 'scaffolding' && !key.startsWith('other_scaffolding'))
            .map(([key, value]) => (
              <RiskNote
                key={key}
                title={key}
                renderTitle={(key) => t(`${key}.title`, { ns: 'formFields' })}
                initialDescription={value.description}
                initialStatus={value.status}
                riskType={value.risk_type}
                onChange={handleInputChange}
              />
          ))}

          <View className="mb-5">
            <Text className="text-lg font-bold py-2">{t('other_scaffolding.title', { ns: 'formFields' })}:</Text>
            <TextInput
              className="border border-dark-green rounded-md p-2 h-24"
              value={formData['other_scaffolding']?.description}
              onChangeText={(value) => handleInputChange('other_scaffolding', 'description', value)}
              multiline={true}
              textAlignVertical="top"
            />
          </View>

          <Text className="text-xl font-bold text-center border-b pb-2">{t('riskform.environmentRisks')}</Text>
          {Object.entries(formData)
            .filter(([key, value]) => value.risk_type === 'environment' && !key.startsWith('other_environment.title'))
            .map(([key, value]) => (
            <RiskNote
              key={key}
              title={key}
              renderTitle={(key) => t(`${key}.title`, { ns: 'formFields' })}
              initialDescription={value.description}
              initialStatus={value.status}
              riskType={value.risk_type}
              onChange={handleInputChange}
            />
          ))}

          <View className="mb-5">
          <Text className="text-lg font-bold py-2">{t('other_environment.title', { ns: 'formFields' })}:</Text>
          <TextInput

            className="border border-dark-green rounded-md p-2 h-24"
            value={formData['other_environment']?.description}
            onChangeText={(value) => handleInputChange('other_environment', 'description', value)}
            multiline={true}
            textAlignVertical="top"
          />
          </View>

          <TouchableOpacity className="bg-[#008000] rounded-md py-3 my-2 items-center" onPress={handleSubmit}>
          <Text className="text-white font-bold text-lg">{t('riskform.submit')}</Text>
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
    </SafeAreaView>
  );
};

export default RiskForm;
