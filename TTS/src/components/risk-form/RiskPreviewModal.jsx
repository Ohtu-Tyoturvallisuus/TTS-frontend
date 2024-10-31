import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '@contexts/FormContext';
import Image from '@components/take-picture/Image';

const RiskPreviewModal = ({
  title,
  renderTitle,
  visible,
  onEditPress,
  onSubmit,
  onClose,
}) => {
  const { getFormData } = useFormContext();
  const description = getFormData(title, 'description');
  const images = getFormData(title, 'images');
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>{renderTitle ? renderTitle(title) : title}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.imageContainer}>
              {images.length === 0 ? (
                <View style={{ margin: 10 }}>
                  <Text>{t('takepicture.noPictures')}</Text>
                </View>
              ) : (
                images.map((image, index) => (
                  <Image
                    key={index}
                    images={images}
                    currentIndex={index}
                    isLandscape={image.isLandscape}
                  />
                ))
              )}
            </View>
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                style={styles.editButton}
                onPress={onEditPress}
              >
                <Text>{t('risknote.edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkedButton}
                onPress={onSubmit}
              >
                <Text>{t('riskeditmodal.checked')}</Text>
              </TouchableOpacity>
            </View>
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
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    maxWidth: 400,
    padding: 20,
    width: '95%',
  },
  checkedButton: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 100,
  },
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 100,
  },
});

export default RiskPreviewModal;