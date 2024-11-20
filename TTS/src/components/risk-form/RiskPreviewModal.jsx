import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '@contexts/FormContext';
import Image from '@components/take-picture/Image';
import CustomModal from '@components/CustomModal';
import TranslationsView from '@components/speech-to-text/TranslationsView';
import { performTranslations } from '@services/performTranslations';
import Loading from '@components/Loading';
import { useTranslationLanguages } from '@contexts/TranslationContext';


const RiskPreviewModal = ({
  title,
  renderTitle,
  visible,
  onEditPress,
  onSubmit,
  onClose,
}) => {
  const { getFormData, updateTranslations } = useFormContext();
  const description = getFormData(title, 'description');
  const translations = getFormData(title, 'translations');
  const images = getFormData(title, 'images');
  const { t } = useTranslation();
  const [newTranslations, setNewTranslations] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fromLang, toLangs} = useTranslationLanguages();

  useEffect(() => {
    const translateDescription = async () => {
      setLoading(true);
      try {
        const { translations: result, error } = await performTranslations(description, fromLang, toLangs);
        console.log('TRANSLATIONS MADE: ', result);
        setNewTranslations(result);
        updateTranslations(title, result);
        setError(error);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (description && translations && Object.keys(translations).length === 0) {
      translateDescription();
    } else {
      console.log('No need to translate. Translation already exists.');
    }
  }, []);

  return (
    <CustomModal visible={visible} onClose={onClose}>
      {loading ? (
        <Loading loading={loading} error={error} title={t('general.loading')} />
      ) : (
        <>
          <Text style={styles.title}>{renderTitle ? renderTitle(title) : title}</Text>
          <Text style={styles.description}>{description}</Text>

          {newTranslations && Object.keys(newTranslations).length > 0 ? (
            <TranslationsView translations={newTranslations} />
          ) : (
            <TranslationsView translations={translations} />
          )}

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
              style={[styles.button, styles.editButton]}
              onPress={onEditPress}
            >
              <Text style={styles.buttonText}>{t('riskmodal.edit')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.checkedButton]}
              onPress={onSubmit}
            >
              <Text style={styles.buttonText}>{t('riskmodal.checked')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </CustomModal>
  );
};

const styles = StyleSheet.create({

  button: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    width: "35%",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkedButton: {
    backgroundColor: 'green',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#ef7d00',
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
});

export default RiskPreviewModal;
