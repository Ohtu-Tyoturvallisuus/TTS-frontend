import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '@contexts/FormContext';
import RiskModal from './RiskModal';

const RiskNote = ({ title, renderTitle }) => {
  const { updateFormData, getFormData } = useFormContext();
  const status = getFormData(title, 'status');

  const [modalVisible, setModalVisible] = useState(false);
  const [isModification, setIsModification] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = () => {
    updateFormData(title, 'status', 'checked');
    setModalVisible(false);
  };

  const handleEditPress = () => {
    setIsModification(true);
    setModalVisible(true);
  };

  // If status is checked then setIsModification is set to true

  return (
    <View testID={`risknote-${title}`}>
      <Text style={styles.riskNote}>{renderTitle ? renderTitle(title) : title}</Text>
      {status === 'checked' ? (
        <View style={styles.choiceDisplay}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{t('risknote.checked')}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      ) : status === 'notRelevant' ? (
        <View style={styles.choiceDisplay}>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: 'grey' }]}>{t('risknote.notRelevant')}</Text>
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
              updateFormData(title, 'status', 'notRelevant');
            }}
          >
            <Text style={styles.buttonText}>{t('risknote.notRelevant')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { borderColor: '#FF8C00' }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>{t('risknote.toBeNoted')}</Text>
          </TouchableOpacity>
        </View>
          )}
      {modalVisible && (
        <RiskModal
          title={title}
          renderTitle={renderTitle}
          visible={modalVisible}
          onSubmit={handleSubmit}
          onClose={() => setModalVisible(false)}
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