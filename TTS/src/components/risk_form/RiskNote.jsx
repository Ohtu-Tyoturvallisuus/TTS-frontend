import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RiskModal from './RiskModal';

const RiskNote = ({ title, initialStatus, initialDescription, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isModification, setIsModification] = useState(false);
  console.log('RiskNote.jsx: ', title, ': ', initialDescription);

  const handleModalSubmit = (newDescription) => {
    setModalVisible(false);
    setStatus('Kunnossa');
    onChange(title, 'description', newDescription);
    onChange(title, 'status', 'Kunnossa');
  };

  const handleEditPress = () => {
    setIsModification(true);
    setModalVisible(true);
  };

  const handleReset = () => {
    console.log('Resetoidaan riski:', title);
    setIsModification(false);
    setStatus('');
    onChange(title, 'description', '');
    onChange(title, 'status', '');
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.riskNote}>{title}</Text>
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
          onChange(title, 'status', 'Ei koske');;
        }}
      >
        <Text style={styles.buttonText}>Ei koske</Text>
      </TouchableOpacity>
    </View>
      )}
      {modalVisible && (
        <RiskModal
          title={title}
          visible={modalVisible}
          initialDescription={initialDescription}
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
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  choiceDisplay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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