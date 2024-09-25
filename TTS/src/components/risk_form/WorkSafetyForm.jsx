import React, { useState, useRef } from 'react';
import { StyleSheet, View, Button, Modal, TextInput, ScrollView, Text } from 'react-native';
import Constants from 'expo-constants';
import RiskNote from './RiskNote';
import { Dimensions } from 'react-native';

const WorkSafetyForm = ({ risks }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const scrollViewRef = useRef(null);
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

  const handleButtonInputChange = (name, value) => {
    handleInputChange(name, value)
      
    // Scroll down to the next view
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: currentViewIndex + Dimensions.get('window').height,
        animated: true,
      });
    }
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
        <ScrollView
        contentContainerStyle={styles.scrollContainer}
        pagingEnabled={true}
        ref={scrollViewRef}
        onScroll={
          event => {
            setCurrentViewIndex(event.nativeEvent.contentOffset.y)
          }
        }>
          <View style={styles.riskNote}>
            <Button title="Sulje" onPress={() => setModalVisible(false)} />
            <Text style={styles.title}>Työturvallisuuslomake</Text>

            {/* Työmaa */}
            <Text style={styles.label}>Työmaa:</Text>
            <TextInput
              style={styles.input}
              value={formData['Työmaa']}
              onChangeText={(value) => handleInputChange('Työmaa', value)}
            />
          </View>

          <View style={styles.riskNote}>
            <Text style={styles.sectionTitle}>Telinetöihin liittyvät vaarat</Text>
          </View>

          {Object.keys(formData)
            .slice(1, 10)  // 1: Aloita toisesta kentästä, 10: Pysähdy "Telineiden puhtaus ja jätteiden lajittelu" jälkeen
            .map(key => (
              <View key={key} style={styles.riskNote}>
                <RiskNote
                  risk={{ note: key }}
                  data={formData[key]}
                  onChange={(value) => handleButtonInputChange(key, value)}
                />
              </View>
          ))}


          {/* Muut telineriskit näytetään heti telinetöihin liittyvien vaarojen jälkeen */}
          <View style={styles.riskNote}>
            <Text style={styles.label}>Muut telineriskit:</Text>
            <TextInput
              style={styles.input}
              value={formData['Muut telineriskit']}
              onChangeText={(value) => handleInputChange('Muut telineriskit', value)}
            />
          </View>

          {/* Muut työympäristöriskit näytetään myöhemmin */}
          <View style={styles.riskNote}>
            <Text style={styles.sectionTitle}>Työympäristön riskit</Text>
          </View>

          {Object.keys(formData)
            .slice(11, 21)
            .map(key => (
              <View key={key} style={styles.riskNote}>
                <RiskNote
                  risk={{ note: key }}
                  data={formData[key]}
                  onChange={(value) => handleButtonInputChange(key, value)}
                />
              </View>
          ))}

          <View style={styles.riskNote}>
            <Text style={styles.label}>Muut työympäristöriskit:</Text>
            <TextInput
              style={styles.input}
              value={formData['Muut työympäristöriskit']}
              onChangeText={(value) => handleInputChange('Muut työympäristöriskit', value)}
            />
          </View>

          <View style={styles.riskNote}>
            <Button title="Lähetä" onPress={handleSubmit} />
            <Button title="Sulje" onPress={() => setModalVisible(false)} />
          </View>
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
  riskNote: {
    flex: 1,
    height: Dimensions.get('window').height,
  },
});

export default WorkSafetyForm;
