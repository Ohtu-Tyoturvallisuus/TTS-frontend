import React, { useState } from 'react';
import { StyleSheet, View, Button, Modal, TextInput, ScrollView, Text } from 'react-native';
import Constants from 'expo-constants';
import RiskNote from './RiskNote';

const WorkSafetyForm = ({ risks }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const local_ip = Constants.expoConfig.extra.local_ip;
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

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log('Lomakkeen tiedot:', JSON.stringify(formData, null, 2));
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Täytä Työturvallisuuslomake" 
        onPress={() => setModalVisible(true)} 
        style={styles.button} 
      />
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Button title="Sulje" onPress={() => setModalVisible(false)} />
          <Text style={styles.title}>Työturvallisuuslomake</Text>

          {/* Työmaa */}
          <Text style={styles.label}>Työmaa:</Text>
          <TextInput
            style={styles.input}
            value={formData['Työmaa']}
            onChangeText={(value) => handleInputChange('Työmaa', value)}
          />

          <Text style={styles.sectionTitle}>Telinetöihin liittyvät vaarat</Text>

          {Object.keys(formData)
            .slice(1, 10)  // 1: Aloita toisesta kentästä, 10: Pysähdy "Telineiden puhtaus ja jätteiden lajittelu" jälkeen
            .map(key => (
              <View key={key}>
                <RiskNote
                  risk={{ note: key }}
                  data={formData[key]}
                  onChange={(value) => handleInputChange(key, value)}
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
                  onChange={(value) => handleInputChange(key, value)}
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
    flex: 1,
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
