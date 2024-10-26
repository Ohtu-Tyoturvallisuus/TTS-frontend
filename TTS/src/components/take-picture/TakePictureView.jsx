import React, { useState } from 'react';
import { Button, View, Platform, StyleSheet, TouchableOpacity, Text, Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Image from './Image';

const TakePictureView = ({ images: initialImages, setImages }) => {
  console.log('TakePictureView:', initialImages);
  const [images, setLocalImages] = useState(initialImages || []);

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
          setImages(newImages); // Update the images state in RiskModal
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

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('image', {
        uri: image.uri,
        name: `photo${index + 1}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await fetch('https://tts-app.azurewebsites.net/api/upload-image/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Image uploaded successfully!', `Image URL: ${data.url}`);
      } else {
        console.log('Upload failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeImage = (uri) => {
    const updatedImages = images.filter(image => image.uri !== uri);
    setLocalImages(updatedImages);
    setImages(updatedImages);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image
            key={index}
            uri={image.uri}
            isLandscape={image.isLandscape}
            onRemove={() => removeImage(image.uri)}
          />
        ))}
      </View>
      {images.length > 0 && <Button title="Upload Images" onPress={uploadImage} />}
      <TouchableOpacity style={styles.roundButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Ota kuva</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  roundButton: {
    width: 50, 
    height: 50, 
    borderRadius: 5, 
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5, 
    marginBottom: 5
  },
  displayImage: {
    width: 200, 
    height: 150, 
    borderRadius: 5,
    marginTop: 5, 
    marginBottom: 5
  },
  smallImage: {
    width: 100, 
    height: 75, 
    borderRadius: 5,
    marginTop: 5, 
    marginBottom: 5,
  },
});

export default TakePictureView;