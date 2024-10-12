import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
        <View style={styles.choiceDisplayView}>
          <Text style={[styles.kunnossaText, { color: 'red' }]}>Ei koske</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setSubmitted(false)
              setNotApplicable(false)
            }}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.choiceDisplayView}>
          <Text style={styles.kunnossaText}>Kunnossa</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setSubmitted(false)
              setNotApplicable(false)
            }}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
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
  choiceDisplayView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16, 
  },
  editButton: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 60
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