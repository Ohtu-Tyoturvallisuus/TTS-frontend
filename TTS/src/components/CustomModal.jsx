import React from 'react';
import { Modal, StyleSheet, ScrollView, View } from 'react-native';

const CustomModal = ({ visible, onClose, children }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
    maxWidth: 400,
    paddingVertical: 20, 
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
  }
});

export default CustomModal;
