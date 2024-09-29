import React, { useState, useRef, useEffect, useContext } from 'react';
import { StyleSheet, View, Button, TextInput, ScrollView, Text } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useNavigate } from 'react-router-native';
import RiskNote from './RiskNote';
import useFetchSurveyData from '../../hooks/useFetchSurveyData';
import { WorksiteSurveyContext } from '../../contexts/WorksiteSurveyContext';

const WorkSafetyForm = () => {
  const { selectedWorksite: worksite, selectedSurveyURL: prevSurveyURL } = useContext(WorksiteSurveyContext);
  const local_ip = Constants.expoConfig.extra.local_ip;

  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [viewHeights, setViewHeights] = useState([]);
  const viewHeightsRef = useRef([]);
  const navigate = useNavigate();
  const scrollViewRef = useRef(null);
  
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

  //Merges fetched survey data to the default formData
  // useEffect(() => {
  //   if (surveyData) {
  //     setSubject(surveyData.title);
  //     const mergedData = { ...formData, ...surveyData.risks };
  //     setFormData(mergedData);
  //   }
  // }, [surveyData]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleButtonInputChange = (name, value) => {
    handleInputChange(name, value);
  
    if (scrollViewRef.current && viewHeightsRef.current.length > 0) {
      // Get the current scroll position (currentViewIndex represents this)
      const currentScrollY = currentViewIndex;
  
      // Find the current view based on scroll Y position
      let currentView = 0;
  
      for (let i = 0; i < viewHeightsRef.current.length; i++) {
        if (currentScrollY >= viewHeightsRef.current[i]) {
          currentView = i;
        }
      }
  
      // Scroll to the next view if there is one
      const nextView = currentView + 1;
  
      if (nextView < viewHeightsRef.current.length) {
        const scrollToY = viewHeightsRef.current[nextView]; // Get the next Y position
        scrollViewRef.current.scrollTo({
          y: scrollToY, // Scroll to the Y position of the next view
          animated: true,
        });
      }
    }
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
    })
    .catch(error => console.error('Error:', error))
  };

  const getHeight = (event) => {
    const { y } = event.nativeEvent.layout
    setViewHeights(prevHeights => {
      const updatedHeights = [...prevHeights, y]
      viewHeightsRef.current = updatedHeights
      return updatedHeights
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      ref={scrollViewRef}
      onScroll={
        event => {
          setCurrentViewIndex(event.nativeEvent.contentOffset.y)
        }
      }
      >

        <Button title="Sulje" onPress={() => navigate('/')} />
        <Text style={styles.title}>Työturvallisuuslomake</Text>

        {/*Työmaa */}
        {/* Display worksite name and location if exists, otherwise input for worksite*/}
        <View onLayout={getHeight}>
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

        <View onLayout={getHeight}>
          <Text style={styles.label}>Työkohde:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={(value) => setSubject(value)}
          />
        </View>

        <Text style={styles.sectionTitle}>Telinetöihin liittyvät vaarat</Text>

        {Object.keys(formData)
          .slice(1, 10)  // 1: Aloita toisesta kentästä, 10: Pysähdy "Telineiden puhtaus ja jätteiden lajittelu" jälkeen
          .map(key => (
            <View key={key} onLayout={getHeight}>
              <RiskNote
                risk={{ note: key }}
                data={formData[key]}
                onChange={handleButtonInputChange}
              />
            </View>
        ))}

        {/* Muut telineriskit näytetään heti telinetöihin liittyvien vaarojen jälkeen */}
        <View onLayout={getHeight}>
          <Text style={styles.label}>Muut telineriskit:</Text>
          <TextInput
            style={styles.input}
            value={formData['Muut telineriskit']}
            onChangeText={(value) => handleInputChange('Muut telineriskit', value)}
          />
        </View>

        {/* Muut työympäristöriskit näytetään myöhemmin */}
        <Text style={styles.sectionTitle}>Työympäristön riskit</Text>

        {Object.keys(formData)
          .slice(11, 21)
          .map(key => (
            <View key={key} onLayout={getHeight}>
              <RiskNote
                risk={{ note: key }}
                data={formData[key]}
                onChange={handleButtonInputChange}
              />
            </View>
        ))}

        <View onLayout={getHeight}>
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
