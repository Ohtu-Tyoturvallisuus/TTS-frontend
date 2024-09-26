import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Modal, TextInput, ScrollView, Text } from 'react-native';
import Constants from 'expo-constants';
import RiskNote from './RiskNote';
import axios from 'axios';

const WorkSafetyForm = ({ worksite, title = 'Tee riskikartoitus', surveyAPIURL=null }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const local_ip = Constants.expoConfig.extra.local_ip;
  const [worksiteId, setWorksiteId] = useState(worksite ? worksite.id : null);
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
  useEffect(() => {
    if (surveyAPIURL) {
      axios.get(surveyAPIURL)
        .then(response => {
          console.log('Survey data:', response.data);
          const risks = JSON.parse(response.data.risks);
          setSubject(response.data.title);
          setFormData(risks);
        })
        .catch(error => console.error('Error fetching survey data:', error));
    }
  }, [surveyAPIURL]);
  

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log('Lomakkeen tiedot:', JSON.stringify(formData, null, 2));
    // Send form data to server

    const risks = JSON.stringify(formData, null, 2);

    axios.post(`http://${local_ip}:8000/api/worksites/${worksiteId}/surveys/`, {
      title: subject,
      description: "",
      risks: risks,
    })
    .then(response => {
      console.log('Server response:', response.data);
      setModalVisible(false);
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <View style={styles.container}>
      <Button 
        title={title}
        onPress={() => setModalVisible(true)} 
      />
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Button title="Sulje" onPress={() => setModalVisible(false)} />
          <Text style={styles.title}>Työturvallisuuslomake</Text>

          {/*Työmaa */}
          {/* Display worksite name and location if exists, otherwise input for worksite*/}
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

          <Text style={styles.label}>Työkohde:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={(value) => setSubject(value)}
          />

          <Text style={styles.sectionTitle}>Telinetöihin liittyvät vaarat</Text>

          {Object.keys(formData)
            .slice(1, 10)  // 1: Aloita toisesta kentästä, 10: Pysähdy "Telineiden puhtaus ja jätteiden lajittelu" jälkeen
            .map(key => (
              <View key={key}>
                <RiskNote
                  risk={{ note: key }}
                  data={formData[key]}
                  onChange={handleInputChange}
                />
              </View>
          ))}

          {/* Muut telineriskit näytetään heti telinetöihin liittyvien vaarojen jälkeen */}
          <Text style={styles.label}>Muut telineriskit:</Text>
          <TextInput
            style={styles.input}
            value={formData['Muut telineriskit']}
            onChangeText={(value) => handleInputChange('Muut telineriskit', value)}
          />

          {/* Muut työympäristöriskit näytetään myöhemmin */}
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

          <Text style={styles.label}>Muut työympäristöriskit:</Text>
          <TextInput
            style={styles.input}
            value={formData['Muut työympäristöriskit']}
            onChangeText={(value) => handleInputChange('Muut työympäristöriskit', value)}
          />

          <Button title="Lähetä" onPress={handleSubmit} />
          <Button title="Sulje" onPress={() => setModalVisible(false)} />
        </ScrollView>
      </Modal>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default WorkSafetyForm;
