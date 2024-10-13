import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RiskModal from './RiskModal';

const RiskNote = ({ risk, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(risk.status);
  const [description, setDescription] = useState(risk.description);
  const [isModification, setIsModification] = useState(false);

  const handleModalSubmit = (newDescription) => {
    setModalVisible(false);
    setStatus('Kunnossa');
    setDescription(newDescription);
    onChange(risk.note, 'description', newDescription);
    onChange(risk.note, 'status', 'Kunnossa');
  };

  const handleEditPress = () => {
    setIsModification(true);
    setModalVisible(true);
  };

  const handleReset = () => {
    console.log('Resetoidaan riski:', risk.note);
    setIsModification(false);
    setStatus('');
    setDescription('');
    onChange(risk.note, 'description', '');
    onChange(risk.note, 'status', '');
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.riskNote}>{risk.note}</Text>
      {status === 'Kunnossa' ? (
        <View style={styles.choiceDisplay}>
          <View style={styles.statusContainer}>
            <Text style={styles.kunnossaText}>Kunnossa</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      ) : status === 'Ei koske' ? (
        <View style={styles.choiceDisplay}>
          <View style={styles.statusContainer}>
            <Text style={[styles.kunnossaText, { color: 'red' }]}>Ei koske</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
  ) : (
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Huomioitavaa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setStatus('Ei koske');
          onChange(risk.note, 'status', 'Ei koske');;
        }}
      >
        <Text style={styles.buttonText}>Ei koske</Text>
      </TouchableOpacity>
    </View>
      )}
      {modalVisible && (
        <RiskModal
          title={risk.note}
          visible={modalVisible}
          initialDescription={description}
          onSubmit={handleModalSubmit}
          onClose={() => setModalVisible(false)}
          onReset={handleReset}
          isModification={isModification}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  choiceDisplay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  kunnossaText: {
    alignSelf: 'center',
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  riskNote: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8
  },
});

export default RiskNote;