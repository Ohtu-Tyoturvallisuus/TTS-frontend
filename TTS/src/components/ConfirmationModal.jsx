import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomModal from './CustomModal';
import { useTranslation } from 'react-i18next';

const ConfirmationModal = ({ visible, onCancel, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <CustomModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onClose={onCancel}
    >
      <Text style={styles.title}>{t('confirmation.confirmLeave')}</Text>
      <Text style={styles.subtitle}>{t('confirmation.changesWillBeLost')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onCancel}
          style={[styles.button, styles.cancelButton]}
        >
          <Text>{t('confirmation.cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onConfirm}
          style={[styles.button, styles.confirmButton]}
        >
          <Text style={styles.confirmButtonText}>{t('confirmation.confirm')}</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    maxWidth: '40%',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#f00',
  },
  confirmButtonText: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ConfirmationModal;