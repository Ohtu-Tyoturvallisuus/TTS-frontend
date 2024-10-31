import React from 'react';
import { Modal, TouchableOpacity, View, StyleSheet } from 'react-native';

const CustomModal = ({ visible, onClose, children, ...props }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={() => {}}>
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    maxWidth: 400,
    padding: 20,
    width: '95%',
  },
});

export default CustomModal;