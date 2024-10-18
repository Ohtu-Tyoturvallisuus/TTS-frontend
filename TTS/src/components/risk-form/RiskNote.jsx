import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RiskModal from './RiskModal';

const RiskNote = ({ title, initialStatus, initialDescription, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isModification, setIsModification] = useState(false);

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
            <Text style={styles.statusText}>Kunnossa</Text>
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
            <Text style={[styles.statusText, { color: 'grey' }]}>Ei koske</Text>
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
        style={[styles.button, { borderColor: 'grey' }]}
        onPress={() => {
          setStatus('Ei koske');
          onChange(title, 'status', 'Ei koske');
        }}
      >
        <Text style={styles.buttonText}>Ei koske</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { borderColor: '#FF8C00' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Huomioitavaa</Text>
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
    borderRadius: 5,
    borderWidth: 1,
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
    color: 'black',
    fontSize: 14,
    letterSpacing: 1,
    textAlign: 'center',
  },
  choiceDisplay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  editButton: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 40,
  },
  riskNote: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8
  },
  statusContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    alignSelf: 'center',
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginVertical: 8,
  },
});

export default RiskNote;