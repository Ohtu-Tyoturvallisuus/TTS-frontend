import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import RiskImage from '@components/take-picture/Image';
import { retrieveImage } from '@services/apiService';
import TranslationItem from '../speech-to-text/TranslationItem';

const FilledRiskNote = ({ renderTitle, riskNote, modalVisible, submitted, language }) => {
  const [retrievedImages, setRetrievedImages] = useState([]);
  const { t } = useTranslation(['translation', 'formFields']);
  console.log('Risknote:', riskNote);

  useEffect(() => {
    if (modalVisible) {
      const fetchImages = async () => {
        const images = await Promise.all(
          riskNote.images?.map(async (image) => {
            if (image.blobName) {
              const uri = await retrieveImage(image.blobName);
              return { uri };
            }
            return null;
          }) || []
        );
        setRetrievedImages(images.filter(Boolean)); // Filter out null values
      };
      submitted && fetchImages();
    }
  }, [riskNote.images, modalVisible]);

  return (
    submitted ? (
      <View className="py-2">
        <Text className="text-base font-bold">
          {renderTitle()}:
        </Text>

        {riskNote.translations[language] ? (
          <TranslationItem
            langCode={language}
            text={riskNote.translations[language]}
          />
        ) : (
          <TranslationItem
            langCode={language}
            text={riskNote.description}
          />
        )}

        {riskNote.images.length > 0 ? (
          <View style={styles.imageContainer}>
          {!retrievedImages.length ? (
            <View style={{ margin: 10 }}>
              <Text>{t('filledriskform.loadingimages')}</Text>
            </View>
          ) : (
            retrievedImages.map((retrievedImage, index) => (
              <View key={index}>
                <RiskImage
                  key={index}
                  images={retrievedImages}
                  currentIndex={index}
                  isLandscape={riskNote.images[index]?.isLandscape}
                  testID={`risk-image-${index}`}
                />
              </View>
            ))
          )}
        </View>
        ) : (
          <View style={{ margin: 10 }}></View>
        )}
      </View>
    ) : (
      <View className="py-2">
        <Text className="text-base font-bold">
          {renderTitle()}:
        </Text>
        <Text>
          {riskNote.description}
        </Text>
        <View style={styles.imageContainer}>
          {!riskNote.images ? (
            <View style={{ margin: 10 }}>
            </View>
          ) : (
            riskNote.images.map((image, index) => (
              <View key={index}>
                <RiskImage
                  key={index}
                  images={riskNote.images}
                  currentIndex={index}
                  isLandscape={image.isLandscape}
                  testID={`risk-image-${index}`}
                />
              </View>
            ))
          )}
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
  },
})

export default FilledRiskNote;
