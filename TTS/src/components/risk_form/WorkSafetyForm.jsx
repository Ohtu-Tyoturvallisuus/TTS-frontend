import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Button, TextInput, ScrollView, Text } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useNavigate } from 'react-router-native';
import RiskNote from './RiskNote';
import useFetchSurveyData from '../../hooks/useFetchSurveyData';
import { ProjectSurveyContext } from '../../contexts/ProjectSurveyContext';
import ButtonGroup from './ButtonGroup';

const WorkSafetyForm = () => {
  const { 
    selectedProject: project, 
    setSelectedProject, 
    selectedSurveyURL: prevSurveyURL, 
    setSelectedSurveyURL 
  } = useContext(ProjectSurveyContext);
  const local_ip = Constants.expoConfig.extra.local_ip;
  const navigate = useNavigate();
  
  const [ task, setTask ] = useState('');
  const [ scaffoldType, setScaffoldType ] = useState('');
  const [ subject, setSubject ] = useState('');
  console.log('Basic info:', task, scaffoldType, subject);

  const [formData, setFormData] = useState({
    'Henkilökohtaiset suojaimet': '',
    'Henkilökohtainen putoamissuojaus (valjaat/tarrain/life line/kaiteet/suojatelineet)': '',
    'Materiaalin varastointi ja pakkaus (kulkutiet huomiointi)': '',
    'Nostoapuvälineet (toimintakunnossa/tarkastettu)': '',
    'Vaara-alue ja sen rajaaminen (putoavien esineiden vaara)': '',
    'Alustan kestävyys (maa/hoitotaso/katto)': '',
    'Ankkurointi (telineen asennus/purku)': '',
    'Sääolosuhteet (tuuli/kylmyys/kuumuus)': '',
    'Ympäristö (siisteys/jätteiden lajittelu)': '',
    'Muu telinetyöhön liittyvä vaara': '', //index 9
    'Liukastuminen/kompastuminen (siisteys/talvikunnossapito/valaistus)': '',
    'Ympäröivät rakenteen ja laitteistot (venttiilit/sähkökaapelit tai -linjat/lasit)': '',
    'Ajoneuvoliikenne/jalankulkija': '',
    'Altisteet (telineiden puhtaus purettaessa/pölyt/kemikaalit/asbesti)': '',
    'Työlupa (valvomoon ilmoittautuminen/henkilökohtaiset suojavälineet/mittarit)': '',
    'Säiliötyölupa': '',
    'Energiasta erottaminen (turvalukitukset)': '',
    'Toiminta hätätilanteessa (hätäpoistumistie)': '',
    'Muu työympäristöön liittyvä vaara': '', //index 17
  });

  //Fetches previous survey's data from API, if survey is in context
  console.log('prevSurveyURL:', prevSurveyURL);
  const { surveyData, error } = useFetchSurveyData(prevSurveyURL);

  // Merges fetched survey data to the default formData
  useEffect(() => {
    if (surveyData) {
      setSubject(surveyData.title);
      const mergedData = { ...formData, ...surveyData.risks };
      setFormData(mergedData);
      console.log('Merged data:', mergedData);
    }
  }, [surveyData]);

  const handleInputChange = (name, value) => {
    console.log('Changed', name, 'to', value === '' ? "empty ('')" : value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const risks = JSON.stringify(formData, null, 2);
    console.log('Lomakkeen tiedot:', risks);
    
    // POST a new survey instance to the API
    axios.post(`http://${local_ip}:8000/api/projects/${project.id}/surveys/`, {
      title: subject,
      description: "",
    })
    .then(response => {
      console.log('Server response:', response.data);
      const surveyId = response.data.id;

      // Post a risk note
      const riskNotes = Object.keys(formData).map(key => ({
        note: key,
        status: formData[key]
      }));

      axios.post(`http://${local_ip}:8000/api/surveys/${surveyId}/risk_notes/`, riskNotes)
        .then(riskNoteResponse => {
          console.log('Risk note response:', riskNoteResponse.data);
          // navigate to front page when successful
          navigate('/');
          console.log('reset project context');
          setSelectedProject(null);
          setSelectedSurveyURL(null);
        })
        .catch(riskNoteError => {
          console.error('Error posting risk note:', riskNoteError);
          console.error('Error status:', riskNoteError.response.status);
          console.error('Error headers:', riskNoteError.response.headers);
        });
    })
    .catch(error => {
      console.error('Error:', error);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    });
  };

  const handleClose = () => {
    setSelectedProject(null);
    setSelectedSurveyURL(null);
    navigate('/');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Button title="Sulje" onPress={handleClose} />
        <Text style={styles.title}>Työturvallisuuslomake</Text>

        {error && <Text>Error fetching survey data</Text>}

        {/* Projektin tiedot */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Projektin nimi:</Text>
          <Text>{project.project_name}</Text>

          <Text style={styles.label}>Projektin ID: </Text>
          <Text>{project.project_id}</Text>

          <Text style={styles.label}>Tehtävä:</Text>
          <ButtonGroup options={['Asennus', 'Muokkaus', 'Purku']} onChange={(value) => setTask(value)} />

          <Text style={styles.label}>Telinetyyppi:</Text>
          <ButtonGroup options={['Työteline', 'Sääsuojaton työteline', 'Sääsuoja']} onChange={(value) => setScaffoldType(value)} />

          <Text style={styles.label}>Mitä olemme tekemässä/ telineen käyttötarkoitus:</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={subject}
            onChangeText={(value) => setSubject(value)}
            multiline={true}
            numberOfLines={4} 
          />
        </View>

        <Text style={styles.sectionTitle}>Telinetöihin liittyvät vaarat</Text>

        {Object.keys(formData)
          .slice(0, 9)
          .map(key => (
            <RiskNote
              key={key}
              risk={{ note: key }}
              data={formData[key]}
              onChange={handleInputChange}
            />
        ))}

        <View>
          <Text style={styles.label}>Muu telinetyöhön liittyvä vaara:</Text>
          <TextInput
            style={styles.input}
            value={formData['Muu telinetyöhön liittyvä vaara']}
            onChangeText={(value) => handleInputChange('Muu telinetyöhön liittyvä vaara', value)}
          />
        </View>

        <Text style={styles.sectionTitle}>Työympäristön riskit</Text>
        {Object.keys(formData)
          .slice(10, 17)
          .map(key => (
            <RiskNote
              key={key}
              risk={{ note: key }}
              data={formData[key]}
              onChange={handleInputChange}
            />
        ))}

        <View>
          <Text style={styles.label}>Muu työympäristöön liittyvä vaara:</Text>
          <TextInput
            style={styles.input}
            value={formData['Muu työympäristöön liittyvä vaara']}
            onChangeText={(value) => handleInputChange('Muu työympäristöön liittyvä vaara', value)}
          />
        </View>

        <Button title="Lähetä" onPress={handleSubmit} />
        <Button title="Sulje" onPress={handleClose} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default WorkSafetyForm;
