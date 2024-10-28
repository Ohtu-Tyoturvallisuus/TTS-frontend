import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-native';
import RiskNote from './RiskNote';
import useFetchSurveyData from '@hooks/useFetchSurveyData';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import ButtonGroup from '@components/buttons/ButtonGroup';
import { postNewSurvey, postRiskNotes } from '@services/apiService';
import CloseButton from '@components/buttons/CloseButton';
import SuccessAlert from '@components/SuccessAlert';

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

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Default risk objects for the form
  const [formData, setFormData] = useState({
    'Henkilökohtaiset suojaimet': { description: '', status: '' },
    'Henkilökohtainen putoamissuojaus (valjaat/tarrain/life line/kaiteet/suojatelineet)': { description: '', status: '' },
    'Materiaalin varastointi ja pakkaus (kulkutiet huomiointi)': { description: '', status: '' },
    'Nostoapuvälineet (toimintakunnossa/tarkastettu)': { description: '', status: '' },
    'Vaara-alue ja sen rajaaminen (putoavien esineiden vaara)': { description: '', status: '' },
    'Alustan kestävyys (maa/hoitotaso/katto)': { description: '', status: '' },
    'Ankkurointi (telineen asennus/purku)': { description: '', status: '' },
    'Sääolosuhteet (tuuli/kylmyys/kuumuus)': { description: '', status: '' },
    'Ympäristö (siisteys/jätteiden lajittelu)': { description: '', status: '' },
    'Muu telinetyöhön liittyvä vaara': { description: '', status: '' }, 
    'Liukastuminen/kompastuminen (siisteys/talvikunnossapito/valaistus)': { description: '', status: '' },
    'Ympäröivät rakenteen ja laitteistot (venttiilit/sähkökaapelit tai -linjat/lasit)': { description: '', status: '' },
    'Ajoneuvoliikenne/jalankulkija': { description: '', status: '' },
    'Altisteet (telineiden puhtaus purettaessa/pölyt/kemikaalit/asbesti)': { description: '', status: '' },
    'Työlupa (valvomoon ilmoittautuminen/henkilökohtaiset suojavälineet/mittarit)': { description: '', status: '' },
    'Säiliötyölupa': { description: '', status: '' },
    'Energiasta erottaminen (turvalukitukset)': { description: '', status: '' },
    'Toiminta hätätilanteessa (hätäpoistumistie)': { description: '', status: '' },
    'Muu työympäristöön liittyvä vaara': { description: '', status: '' }, 
  });

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
      return postRiskNotes(surveyId, riskNotes);
    })
    .then(() => {
      // navigate to front page when successful
      setShowSuccessAlert(true);
    })
    .catch(error => {
      console.error('Error during form submission:', error);
      alert('Lomakkeen lähettäminen epäonnistui');
    });
};

  const handleClose = () => {
    setSelectedProject(null);
    setSelectedSurveyURL(null);
    setShowSuccessAlert(false);
    navigate('/');
  }

  return (
    <View className="flex-1 items-center justify-center">
      <ScrollView className="bg-white flex-grow p-5">
        <Text className="text-2xl font-bold text-center pb-5">Vaarojen tunnistus</Text>
  
        {error && <Text>Error fetching survey data</Text>}
  
        {/* Projektin tiedot */}
        {project ? (
          <View className="mb-5">
            <Text className="text-lg font-bold py-2">Projektin nimi:</Text>
            <Text>{project.project_name}</Text>
  
            <Text className="text-lg font-bold py-2">Projektin ID: </Text>
            <Text>{project.project_id}</Text>
  
            <Text className="text-lg font-bold py-2">Tehtävä:</Text>
            <ButtonGroup 
              options={['Asennus', 'Muokkaus', 'Purku']} 
              selectedValue={task}
              onChange={(value) => setTask(value)} 
            />
  
            <Text className="text-lg font-bold py-2">Telinetyyppi:</Text>
            <ButtonGroup 
              options={['Työteline', 'Sääsuojaton työteline', 'Sääsuoja']} 
              selectedValue={scaffoldType} 
              onChange={(value) => setScaffoldType(value)} 
            />
  
            <Text className="text-lg font-bold py-2">Mitä olemme tekemässä/ telineen käyttötarkoitus:</Text>
            <TextInput
              className="border border-dark-green rounded-md p-2 h-24"
              value={taskDesc}
              onChangeText={(value) => setSubject(value)}
              multiline={true}
              textAlignVertical="top"
            />
          </View>
        ) : (
          <Text>Not seeing project...</Text>
        )}
  
        <Text className="text-xl font-bold text-center border-b pb-2">Telinetöihin liittyvät vaarat</Text>
        {Object.keys(formData)
          .slice(0, 9)
          .map(key => (
            <RiskNote
              key={key}
              title={key}
              initialDescription={formData[key].description}
              initialStatus={formData[key].status}
              onChange={handleInputChange}
            />
        ))}
  
        <View className="mb-5">
          <Text className="text-lg font-bold py-2">Muu telinetyöhön liittyvä vaara:</Text>
          <TextInput
            className="border border-dark-green rounded-md p-2 h-24"
            value={formData['Muu telinetyöhön liittyvä vaara'].description}
            onChangeText={(value) => handleInputChange('Muu telinetyöhön liittyvä vaara', 'description', value)}
            multiline={true}
            textAlignVertical="top"
          />
        </View>
  
        <Text className="text-xl font-bold text-center border-b pb-2">Työympäristön riskit</Text>
        {Object.keys(formData)
          .slice(10, 18)
          .map(key => (
            <RiskNote
              key={key}
              title={key}
              initialDescription={formData[key].description}
              initialStatus={formData[key].status}
              onChange={handleInputChange}
            />
        ))}
  
        <View className="mb-5">
          <Text className="text-lg font-bold py-2">Muu työympäristöön liittyvä vaara:</Text>
          <TextInput

            className="border border-dark-green rounded-md p-2 h-24"
            value={formData['Muu työympäristöön liittyvä vaara'].description}
            onChangeText={(value) => handleInputChange('Muu työympäristöön liittyvä vaara', 'description', value)}
            multiline={true}
            textAlignVertical="top"
          />
        </View>
  
        <TouchableOpacity className="bg-[#008000] rounded-md py-3 my-2 items-center" onPress={handleSubmit}>
        <Text className="text-white font-bold text-lg">Lähetä</Text>
      </TouchableOpacity>

        <CloseButton onPress={handleClose} />
      </ScrollView>
      {showSuccessAlert && (
        <SuccessAlert 
          message="Lomake lähetetty onnistuneesti!" 
          onDismiss={handleClose} 
        />
      )}
    </View>
  );
};

export default WorkSafetyForm;
