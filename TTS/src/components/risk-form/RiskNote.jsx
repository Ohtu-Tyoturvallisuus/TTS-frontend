import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '@contexts/FormContext';
import RiskEditModal from './RiskEditModal';
import RiskPreviewModal from './RiskPreviewModal';

const RiskNote = ({ title, renderTitle }) => {
  const { updateFormData, getFormData } = useFormContext();
  const status = getFormData(title, 'status');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = () => {
    updateFormData(title, 'status', 'checked');
    setPreviewModalVisible(false);
  };

  handleTranslatePress = () => {
    setEditModalVisible(false);
    // TRANSLATION HAPPENS HERE (I GUESS) 
    setPreviewModalVisible(true);
  };

  const handleReset = () => {
    updateFormData(title, 'description', '');
    updateFormData(title, 'status', '');
    updateFormData(title, 'images', []);
    setEditModalVisible(false);
  };

  const handlePreviewPress = () => {
    setPreviewModalVisible(true);
  };

  const handlePreviewEditPress = () => {
    setPreviewModalVisible(false);
    setEditModalVisible(true);
  };

  return (
    <View testID={`risknote-${title}`}>
      <Text style={styles.riskNote}>{renderTitle ? renderTitle(title) : title}</Text>
      {status === 'checked' ? (
        <View style={styles.choiceDisplay}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{t('risknote.checked')}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePreviewPress}
          >
            <Text>Esikatsele</Text>
          </TouchableOpacity>
        </View>
      ) : status === 'notRelevant' ? (
        <View style={styles.choiceDisplay}>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: 'grey' }]}>{t('risknote.notRelevant')}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleReset}
          >
            <Text>{t('risknote.undo')}</Text>
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
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.buttonText}>{t('risknote.toBeNoted')}</Text>
          </TouchableOpacity>
        </View>
          )}
      {previewModalVisible && (
        <RiskPreviewModal
          title={title}
          renderTitle={renderTitle}
          visible={previewModalVisible}
          onEditPress={handlePreviewEditPress}
          onSubmit={handleSubmit}
          onClose={() => setPreviewModalVisible(false)}
        />
      )}
      {editModalVisible && (
        <RiskEditModal
          title={title}
          renderTitle={renderTitle}
          visible={editModalVisible}
          onTranslate={handleTranslatePress}
          onReset={handleReset}
          onClose={() => setEditModalVisible(false)}
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
  actionButton: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
    position: 'absolute',
    right: 30,
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