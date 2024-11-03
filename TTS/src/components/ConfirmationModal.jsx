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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    maxWidth: '40%',
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
});

export default ConfirmationModal;