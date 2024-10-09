import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import RiskModal from './RiskModal';

const RiskNote = ({ risk, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notApplicable, setNotApplicable] = useState(false);

  const onPress = (note, value) => {
    if (value === 'Huomioitavaa') {
      setModalVisible(true);
    } else if (value === 'Ei koske') {
      setNotApplicable(true);
      setSubmitted(true);
    }
  };

  return (
    <View>
      <Text style={styles.riskNote}>{risk.note}</Text>
      {!submitted ? (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPress(risk.note, 'Huomioitavaa')}
          >
            <Text style={styles.buttonText}>Huomioitavaa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPress(risk.note, 'Ei koske')}
          >
            <Text style={styles.buttonText}>Ei koske</Text>
          </TouchableOpacity>
        </View>
      ) : notApplicable ? (
        <Text style={[styles.kunnossaText, { color: 'red' }]}>Ei koske</Text>
      ) : (
        <Text style={styles.kunnossaText}>Kunnossa</Text>
      )}
      {modalVisible && (
        <RiskModal
          title={risk.note}
          visible={modalVisible}
          onSubmit={(description) => {
            setModalVisible(false);
            setSubmitted(true);
          }}
          onClose={() => {
            setModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  riskNote: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  kunnossaText: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'green',
  },
});

export default RiskNote;