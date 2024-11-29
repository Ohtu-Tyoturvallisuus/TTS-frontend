import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import RiskImage from '@components/take-picture/Image';

const FilledRiskNote = ({ renderTitle, key, value, modalVisible, retrieveImage }) => {
  const [retrievedImages, setRetrievedImages] = useState([]);
  const { t } = useTranslation(['translation', 'formFields']);
                    
  useEffect(() => {
    if (modalVisible) {
      const fetchImages = async () => {
        const images = await Promise.all(
          value.images?.map(async (image) => {
            if (image.blobName) {
              const uri = await retrieveImage(image.blobName);
              return { uri };
            }
            return null;
          }) || []
        );
        setRetrievedImages(images.filter(Boolean)); // Filter out null values
      };
      fetchImages();
    }
  }, [value.images, modalVisible]);

  return (
    <View key={key} className="py-2">
      <Text className="text-base font-bold">
        {renderTitle()}:
      </Text>
      <Text>
        {value.description}
      </Text>
      {value.images.length > 0 ? (
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
                isLandscape={value.images[index]?.isLandscape}
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