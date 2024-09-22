import React, { useState } from 'react';
import { StyleSheet, View, Button, Modal, TextInput, ScrollView, Text } from 'react-native';
import Constants from 'expo-constants';
import RiskNote from './RiskNote';

const WorkSafetyForm = ({risks}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const local_ip = Constants.expoConfig.extra.local_ip;
  const [formData, setFormData] = useState({
    WorkSite: '',
    PersonalProtectiveEquipment: 'Kunnossa',
    PlatformDurability: 'Kunnossa',
    WorksiteFallProtection: 'Kunnossa',
    HazardAreaMarking: 'Kunnossa',
    WorkOrderMethodErgonomics: 'Kunnossa',
    ScaffoldStability: 'Kunnossa',
    LiftingEquipmentInspection: 'Kunnossa',
    MaterialStorageAndAccess: 'Kunnossa',
    ScaffoldCleanlinessAndWasteSorting: 'Kunnossa',
    OtherScaffoldRisks: '',
    TrafficPedestriansOtherWork: 'Kunnossa',
    SlippingTripping: 'Kunnossa',
    Lighting: 'Kunnossa',
    ElectricalLinesConsidered: 'Kunnossa',
    WeatherConditionsConsidered: 'Kunnossa',
    OperatingMachinesEquipmentConsidered: 'Kunnossa',
    ContaminantsConsidered: 'Kunnossa',
    TemperatureConsiderations: 'Kunnossa',
    WorkPermitsReportingSafetyInstructions: 'Kunnossa',
    EmergencyProcedureAndExit: 'Kunnossa',
    OtherWorkEnvironmentRisks: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = () => {
  //   fetch('http://' + local_ip + ':8000/api/worksafetychecklist/', { 
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(formData),
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Lähetetty Data:', data);
  //       setFormData({
  //         WorkSite: '',
  //         PersonalProtectiveEquipment: 'Kunnossa',
  //         PlatformDurability: 'Kunnossa',
  //         WorksiteFallProtection: 'Kunnossa',
  //         HazardAreaMarking: 'Kunnossa',
  //         WorkOrderMethodErgonomics: 'Kunnossa',
  //         ScaffoldStability: 'Kunnossa',
  //         LiftingEquipmentInspection: 'Kunnossa',
  //         MaterialStorageAndAccess: 'Kunnossa',
  //         ScaffoldCleanlinessAndWasteSorting: 'Kunnossa',
  //         OtherScaffoldRisks: '',
  //         TrafficPedestriansOtherWork: 'Kunnossa',
  //         SlippingTripping: 'Kunnossa',
  //         Lighting: 'Kunnossa',
  //         ElectricalLinesConsidered: 'Kunnossa',
  //         WeatherConditionsConsidered: 'Kunnossa',
  //         OperatingMachinesEquipmentConsidered: 'Kunnossa',
  //         ContaminantsConsidered: 'Kunnossa',
  //         TemperatureConsiderations: 'Kunnossa',
  //         WorkPermitsReportingSafetyInstructions: 'Kunnossa',
  //         EmergencyProcedureAndExit: 'Kunnossa',
  //         OtherWorkEnvironmentRisks: '',
  //       });
  //       setModalVisible(false);
  //     })
  //     .catch(error => console.error('Virhe tietojen lähettämisessä:', error));
  // };

  const renderButtonGroup = (name) => (
    <View style={styles.buttonGroup}>
      <Button
        title="Kunnossa"
        onPress={() => handleInputChange(name, 'Kunnossa')}
        color={formData[name] === 'Kunnossa' ? 'blue' : 'gray'}
      />
      <Button
        title="Ei koske"
        onPress={() => handleInputChange(name, 'Ei koske')}
        color={formData[name] === 'Ei koske' ? 'blue' : 'gray'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Button title="Sulje" onPress={() => setModalVisible(false)} />
          <Text style={styles.title}>Työturvallisuuslomake</Text>

          <Text style={styles.label}>Työmaa:</Text>
          <TextInput
            style={styles.input}
            value={formData.WorkSite}
            onChangeText={(value) => handleInputChange('WorkSite', value)}
          />

          <Text style={styles.sectionTitle}>Telinetöihin liittyvät vaarat</Text>

          {Object.entries(formData).map(([key, value]) => (
          <RiskNote
            key={key}
            risk={{ note: key }}
            data={value}
            onChange={handleInputChange}
          />
        ))}

          <Text style={styles.label}>Muu, mikä?</Text>
          <TextInput
            style={styles.input}
            value={formData.OtherWorkEnvironmentRisks}
            onChangeText={(value) => handleInputChange('OtherWorkEnvironmentRisks', value)}
          />

          <Button title="Lähetä" onPress={()=>console.log(JSON.stringify(formData, null, 2))} />
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
