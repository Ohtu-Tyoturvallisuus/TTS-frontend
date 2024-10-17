import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Button, TextInput, ScrollView, Text } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useTranslation } from 'react-i18next';
import RiskNote from './RiskNote';
import useFetchSurveyData from '../../hooks/useFetchSurveyData';
import { ProjectSurveyContext } from '../../contexts/ProjectSurveyContext';
import ButtonGroup from './ButtonGroup';
import { postNewSurvey, postRiskNotes } from '../../services/apiService';
import enFormFields from '../../lang/locales/en/formFields.json';
import fiFormFields from '../../lang/locales/fi/formFields.json';

const WorkSafetyForm = () => {
  const { 
    selectedProject: project, 
    setSelectedProject, 
    selectedSurveyURL: prevSurveyURL, 
    setSelectedSurveyURL 
  } = useContext(ProjectSurveyContext);
  const navigate = useNavigate();
  
  const [ task, setTask ] = useState('');
  const [ scaffoldType, setScaffoldType ] = useState('');
  const [ taskDesc, setSubject ] = useState('');

  const { t, i18n } = useTranslation(['translation', 'formFields']);

  const getFormFieldsByLanguage = () => {
    switch (i18n.language) {
      case 'fi': // Finnish language
        return fiFormFields;
      case 'en': // English language
      default:
        return enFormFields;  // Fallback to English if no match
    }
  };

  const createInitialFormData = (formFields) => {
    const initialData = {};
    Object.keys(formFields).forEach((key) => {
      initialData[t(`${key}.title`, { ns: 'formFields' })] = {
        description: '',
        status: '',
        type: t(`${key}.type`, { ns: 'formFields' }),
      };
    });
    return initialData;
  };

  const formFields = getFormFieldsByLanguage();

  // Default risk objects for the form
  const [formData, setFormData] = useState(createInitialFormData(formFields));

  useEffect(() => {
    // Update formData whenever the language changes
    const updatedFormFields = getFormFieldsByLanguage();
    setFormData(createInitialFormData(updatedFormFields));
  }, [i18n.language]);

  //Fetches previous survey's data from API, if survey is in context
  const { surveyData, error } = useFetchSurveyData(prevSurveyURL);

  // Merges previous surveys descriptions into formData
  useEffect(() => {
    if (surveyData) {
      setTask(surveyData.task);
      setScaffoldType(surveyData.scaffold_type);
      setSubject(surveyData.description);
      const updatedFormData = { ...formData };

      // Update descriptions for each risk note
      surveyData.risk_notes.forEach(note => {
        if (updatedFormData[note.note]) {
            updatedFormData[note.note].description = note.description;
        }
      });
      console.log('Updated form data:', JSON.stringify(updatedFormData, null, 2));
      setFormData(updatedFormData);
    }
  }, [surveyData]);

  const handleInputChange = (title, field, value) => {
    setFormData(prevFormData => {
      console.log('Changed', title, field, 'to', value);
      return {
        ...prevFormData,
        [title]: {
          ...prevFormData[title],
          [field]: value,
        },
      };
    });
  };

  const handleSubmit = () => {
    // ------------------------------------------------
    //         TODO: Implement form submit checks
    // ------------------------------------------------
    
    // POST a new survey instance 
    postNewSurvey(project.id, taskDesc, task, scaffoldType)
    .then(response => {
      console.log('Server response:', response);
      const surveyId = response.id;

    // Formatting formData as list of django risk_note instances
    const riskNotes = Object.keys(formData).map(key => ({
      note: key,
      description: formData[key].description,
      status: formData[key].status
    }));
    console.log('Risk notes:', JSON.stringify(riskNotes, null, 2));

    // POST risk notes to the just made survey
    postRiskNotes(surveyId, riskNotes)
      .then(() => {
        // navigate to front page when successful
        handleClose();
        alert(t('worksafetyform.successMessage'));
      })
    })
  };

  const handleClose = () => {
    setSelectedProject(null);
    setSelectedSurveyURL(null);
    navigate('/');
  }

  let scaffoldRisks = Object.entries(formData)
  .filter(([key, value]) => value.type === 'scaffolding' && !key.startsWith('other'))
  let environmentRisks = Object.entries(formData)
  .filter(([key, value]) => value.type === 'environment' && !key.startsWith('other'))

  console.log('Form data:', formData); 
  console.log('Scaffold risks:', scaffoldRisks);
  console.log('Environment risks:', environmentRisks);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Button title={t('worksafetyform.close')} onPress={handleClose} />
        <Text style={styles.title}>{t('worksafetyform.title')}</Text>
  
        {error && <Text>{t('worksafetyform.errorFetchingData')}</Text>}
  
        {/* Projektin tiedot */}
        {project ? (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>{t('worksafetyform.projectName')}:</Text>
            <Text>{project.project_name}</Text>
  
            <Text style={styles.label}>{t('worksafetyform.projectId')}: </Text>
            <Text>{project.project_id}</Text>
  
            <Text style={styles.label}>{t('worksafetyform.task')}:</Text>
            <ButtonGroup 
              options={[t('worksafetyform.installation'), t('worksafetyform.modification'), t('worksafetyform.dismantling')]} 
              selectedValue={task}
              onChange={(value) => setTask(value)} 
            />
  
            <Text style={styles.label}>{t('worksafetyform.scaffoldType')}:</Text>
            <ButtonGroup 
              options={[t('worksafetyform.workScaffold'), t('worksafetyform.nonWeatherproof'), t('worksafetyform.weatherproof')]} 
              selectedValue={scaffoldType} 
              onChange={(value) => setScaffoldType(value)} 
            />
  
            <Text style={styles.label}>{t('worksafetyform.taskDescription')}:</Text>
            <TextInput
              style={styles.input}
              value={taskDesc}
              onChangeText={(value) => setSubject(value)}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
        ) : (
          <Text>{t('worksafetyform.noProject')}</Text>
        )}
  
        <Text style={styles.sectionTitle}>{t('worksafetyform.scaffoldRisks')}</Text>
        {Object.entries(formData)
          .filter(([key, value]) => value.type === 'scaffolding' && !key.startsWith('other'))
          .map(([key, value]) => (
            <RiskNote
              key={key}
              title={key}
              initialDescription={value.description}
              initialStatus={value.status}
              onChange={handleInputChange}
            />
        ))}
  
        <View>
          <Text style={styles.label}>{t('other_scaffolding.title', { ns: 'formFields' })}:</Text>
          <TextInput
            style={styles.input}
            value={formData[t('other_scaffolding.title', { ns: 'formFields' })].description}
            onChangeText={(value) => handleInputChange(t('other_scaffolding.title', { ns: 'formFields' }), 'description', value)}
            multiline={true}
            textAlignVertical="top"
          />
        </View>
  
        <Text style={styles.sectionTitle}>{t('worksafetyform.environmentRisks')}</Text>
        {Object.entries(formData)
          .filter(([key, value]) => value.type === 'environment' && !key.startsWith('other'))
          .map(([key, value]) => (
            <RiskNote
              key={key}
              title={key}
              initialDescription={value.description}
              initialStatus={value.status}
              onChange={handleInputChange}
            />
        ))}
  
        <View>
          <Text style={styles.label}>{t('other_environment.title', { ns: 'formFields' })}:</Text>
          <TextInput
            style={styles.input}
            value={formData[t('other_environment.title', { ns: 'formFields' })].description}
            onChangeText={(value) => handleInputChange(t('other_environment.title', { ns: 'formFields' }), 'description', value)}
            multiline={true}
            textAlignVertical="top"
          />
        </View>
  
        <Button title={t('worksafetyform.submit')} onPress={handleSubmit} />
        <Button title={t('worksafetyform.close')} onPress={handleClose} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center',
  },
});

export default WorkSafetyForm;
