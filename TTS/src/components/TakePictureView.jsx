import React, { useState } from 'react';
import { Button, Image, View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TakePictureView = () => {
  const [image, setImage] = useState(null);

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
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      console.log('Attempted to upload without image');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg',
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.roundButton} onPress={pickImage}>
        <Image source={require('../../assets/camera.png')} style={styles.roundButton} />
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.displayImage} />}
      {image && <Button title="Upload Image" onPress={uploadImage} />}
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
  roundButton: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
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
});

export default TakePictureView;