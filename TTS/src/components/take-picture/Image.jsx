import React, { useState } from 'react';
import { Image as RNImage, View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const Image = ({ images, currentIndex, onRemove = null, isLandscape }) => {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleImagePress = () => {
    setIsEnlarged(!isEnlarged);
  };

  return (
    <View style={styles.imageWrapper}>
      <TouchableOpacity onPress={handleImagePress}>
        <RNImage
          testID={`risk-image-${currentIndex}`}
          source={{ uri: images[currentIndex].uri }}
          style={isLandscape ? styles.landscapeImage : styles.portraitImage}
        />
      </TouchableOpacity>
      {onRemove && (
        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(images[currentIndex].uri)}>
          <Text style={styles.removeButtonText}>X</Text>
        </TouchableOpacity>
      )}
      {isEnlarged && (
        <Modal
          testID='image-modal'
          transparent={true}
          animationType="none"
          visible={isEnlarged}
          onRequestClose={() => setIsEnlarged(false)}
        >
          <ImageViewer
            imageUrls={images.map(image => ({ url: image.uri }))}
            index={currentIndex}
            onClick={() => setIsEnlarged(false)}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    marginRight: 5,
    marginTop: 10,
    position: 'relative',
  },
  landscapeImage: {
    borderRadius: 4,
    height: 93.75,
    width: 125, 
  },
  portraitImage: {
    borderRadius: 4,
    height: 125, 
    width: 93.75, 
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: -5,
    width: 20,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default Image;