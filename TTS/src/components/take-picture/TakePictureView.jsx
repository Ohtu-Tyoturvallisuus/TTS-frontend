import React, { useState, useEffect } from 'react';
import { Button, View, Platform, StyleSheet, TouchableOpacity, Text, Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Image from './Image';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '@contexts/FormContext';
import { postImages } from '@services/apiService';

const TakePictureView = ({ title }) => {
  const { t } = useTranslation();
  const { getFormData, updateFormData } = useFormContext();
  const initialImages = getFormData(title, 'images');
  const [images, setLocalImages] = useState(initialImages || []);

  useEffect(() => {
    setLocalImages(initialImages);
  }, [initialImages]);

  const pickImage = async () => {
    // Request permission to access camera
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.log('Camera permissions denied');
        return;
      }
    }

    // Open camera to take a picture
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('TakePictureView:', result)

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      RNImage.getSize(uri, (width, height) => {
        const isLandscape = width > height;
        setLocalImages(prevImages => {
          const newImages = [...prevImages, { uri, isLandscape }];
          // Use a callback to update the context state after the render phase
          setTimeout(() => {
            updateFormData(title, 'images', newImages);
            // Example: 
            // [{"isLandscape": false, "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FHazardHunt-45559436-e494-4c06-9d16-105489cdb499/ImagePicker/3a8580ac-588d-4c47-8670-8b94008906d3.jpeg"}]
          }, 0);
          return newImages;
        });
      }, (error) => {
        console.error(error);
      });
    }
  };

  const uploadImage = async () => {
    if (images.length === 0) {
      console.log('Attempted to upload without image');
      return;
    }

    const imageData = new FormData();
    images.forEach((image, index) => {
      imageData.append(`image${index + 1}`, {
        uri: image.uri,
        name: `${title}_photo${index + 1}.jpg`,
        type: 'image/jpeg',
      });
    });
    console.log('Uploading images:', imageData);
    try {
      const response = await postImages(imageData);
      console.log('Images uploaded successfully:', response);
      const blobNames = response.urls.map(url => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      });
      console.log('Blob names:', blobNames);
      alert('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const removeImage = (uri) => {
    const updatedImages = images.filter(image => image.uri !== uri);
    setLocalImages(updatedImages);
    updateFormData(title, 'images', updatedImages);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.roundButton} onPress={pickImage}>
        <Text style={styles.buttonText}>{t('takepicture.takePicture')}</Text>
      </TouchableOpacity>
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
        {images.length > 0 && <Button title="Lähetä kuvat palvelimelle(test)" onPress={uploadImage} />}
    </View>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 10,
    padding: 5,
    paddingVertical: 10, 
    width: '50%'
  },
});

export default TakePictureView