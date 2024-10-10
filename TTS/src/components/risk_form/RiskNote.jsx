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
  choiceDisplayView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16, 
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default RiskNote;