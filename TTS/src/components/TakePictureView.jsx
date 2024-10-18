import React, { useState } from 'react';
import { Button, Image, View, Platform } from 'react-native';
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
      <Button title="Take a photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: "100%", height: "50%" }} />}
      {image && <Button title="Upload Image" onPress={uploadImage} />}
    </View>
  );
}

export default TakePictureView;