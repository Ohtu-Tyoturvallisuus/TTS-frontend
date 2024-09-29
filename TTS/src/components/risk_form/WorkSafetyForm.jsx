import React, { useState, useRef, useEffect, useContext } from 'react';
import { StyleSheet, View, Button, TextInput, ScrollView, Text } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useNavigate } from 'react-router-native';
import RiskNote from './RiskNote';
import useFetchSurveyData from '../../hooks/useFetchSurveyData';
import { WorksiteSurveyContext } from '../../contexts/WorksiteSurveyContext';

const WorkSafetyForm = () => {
  const { 
    selectedWorksite: worksite, 
    setSelectedWorksite, 
    selectedSurveyURL: prevSurveyURL, 
    setSelectedSurveyURL 
  } = useContext(WorksiteSurveyContext);
  const local_ip = Constants.expoConfig.extra.local_ip;
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState('');
  const [formData, setFormData] = useState({
    'Työmaa': '',
    'Henkilökohtaiset suojaimet / kohteen edellyttämät erityissuojaimet': '',
    'Alustan kestävyys (maaperä/työalusta)': '',
    'Työnaikainen putoamissuojaus': '',
    'Vaara-alueen merkintä (putoavan esineen vaara)': '',
    'Työjärjestys/työmenetelmä ja ergonomia': '',
    'Ankkuroinnin tai telineen vakaus': '',
    'Nostoapuvälineiden tarkastus': '',
    'Materiaalin varastointi ja kulkutiet huomioitu': '',
    'Telineiden puhtaus ja jätteiden lajittelu': '',
    'Muut telineriskit': '',
    'Ajoneuvoliikenne/jalankulkijat/muut työt': '',
    'Liukastuminen/kompastuminen': '',
    'Valaistus': '',
    'Sähkölinjat huomioitu': '',
    'Sääolosuhteet huomioitu': '',
    'Käynnissä olevat koneet/laitteet huomioitu ja tarvittaessa suojattu': '',
    'Altisteet huomioitu (pöly, kemikaalit, asbesti)': '',
    'Poikkeava lämpötila huomioitu': '',
    'Työluvat/valvomoon ilmoittautuminen/turvalukitukset': '',
    'Toiminta hätätilanteessa/hätäpoistumistie tiedossa': '',
    'Muut työympäristöriskit': '',
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const risks = JSON.stringify(formData, null, 2);
    console.log('Lomakkeen tiedot:', risks);
    
    // Send form data to server
    axios.post(`http://${local_ip}:8000/api/worksites/${worksite.id}/surveys/`, {
      title: subject,
      description: "",
      risks: risks,
    })
    .then(response => {
      console.log('Server response:', response.data);
      // navigate to front page when successful
      navigate('/')
      console.log('reset worksite context')
      setSelectedWorksite(null);
      setSelectedSurveyURL(null);
    })
    .catch(error => {
      console.error('Error:', error)
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    })
  };

  return (
    <View style={styles.container}>
      <ScrollView
      contentContainerStyle={styles.scrollContainer}
      >

        <Button title="Sulje" onPress={() => navigate('/')} />
        <Text style={styles.title}>Työturvallisuuslomake</Text>

        {error && <Text>Error fetching survey data</Text>}

        {/*Työmaa */}
        {/* Display worksite name and location if given,
            otherwise render input field for worksite*/}
        <View>
          <Text style={styles.label}>Työmaa:</Text>

          {worksite ? (
            <Text>{worksite.name}, {worksite.location}</Text>
          ) : (
            <TextInput
            style={styles.input}
              value={subject}
              onChangeText={(value) => handleInputChange('Työmaa', value)}
              />
          )}
        </View>

        <View>
          <Text style={styles.label}>Työkohde:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={(value) => setSubject(value)}
          />
        </View>

        <Text style={styles.sectionTitle}>Telinetöihin liittyvät vaarat</Text>

        {Object.keys(formData)
          .slice(1, 10) 
          .map(key => (
            <View key={key}>
              <RiskNote
                risk={{ note: key }}
                data={formData[key]}
                onChange={handleInputChange}
                />
            </View>
        ))}

        <View>
          <Text style={styles.label}>Muut telineriskit:</Text>
          <TextInput
            style={styles.input}
            value={formData['Muut telineriskit']}
            onChangeText={(value) => handleInputChange('Muut telineriskit', value)}
            />
        </View>

        <Text style={styles.sectionTitle}>Työympäristön riskit</Text>
        {Object.keys(formData)
          .slice(11, 21)
          .map(key => (
            <View key={key}>
              <RiskNote
                risk={{ note: key }}
                data={formData[key]}
                onChange={handleInputChange}
                />
            </View>
        ))}

        <View>
          <Text style={styles.label}>Muut työympäristöriskit:</Text>
          <TextInput
            style={styles.input}
            value={formData['Muut työympäristöriskit']}
            onChangeText={(value) => handleInputChange('Muut työympäristöriskit', value)}
          />
        </View>

        <Button title="Lähetä" onPress={handleSubmit} />
        <Button title="Sulje" onPress={() => navigate('/')} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
