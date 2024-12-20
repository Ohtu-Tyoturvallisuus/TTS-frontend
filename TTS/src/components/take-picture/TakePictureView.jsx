import React, { useState, useEffect } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text, Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Image from './Image';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '@contexts/FormContext';

const TakePictureView = ({ title }) => {
  const { t } = useTranslation();
  const { getFormData, updateFormField } = useFormContext();
  const initialImages = getFormData(title, 'images');
  const [images, setImages] = useState(initialImages || []);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const pickImage = async (source) => {
    // Request appropriate permissions based on the source
    if (Platform.OS !== 'web') {
      let permissionStatus;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        permissionStatus = status;
      } else if (source === 'gallery') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        permissionStatus = status;
      }
      if (permissionStatus !== 'granted') {
        console.log(`${source} permissions denied`);
        return;
      }
    }
  
    // Open camera or gallery based on the source
    let result = {};
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
    } else if (source === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
    }
  
    console.log('Image result:', result);
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      RNImage.getSize(uri, (width, height) => {
        const isLandscape = width > height;
        setImages(prevImages => {
          const newImages = [...prevImages, { uri, isLandscape }];
          setTimeout(() => {
            updateFormField(title, 'images', newImages);
          }, 0);
          return newImages;
        });
      }, (error) => {
        console.error(error);
      });
    }
  };

  const removeImage = (uri) => {
    const updatedImages = images.filter(image => image.uri !== uri);
    setImages(updatedImages);
    updateFormField(title, 'images', updatedImages);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.roundButton} onPress={() => pickImage('gallery')}>
          <Text style={styles.buttonText}>{t('takepicture.selectFromGallery')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundButton} onPress={() => pickImage('camera')}>
          <Text style={styles.buttonText}>{t('takepicture.takePicture')}</Text>
        </TouchableOpacity>
      </View>
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
              onRemove={removeImage}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
    letterSpacing: 1,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: 5,
  },
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
  },
  roundButton: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1, 
    flex: 1,
    justifyContent: 'center',
    marginBottom: 5,
    marginHorizontal: 3,
    marginTop: 10, 
    padding: 10,
  },
});

export default TakePictureView