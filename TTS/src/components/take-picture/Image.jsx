import React, { useState } from 'react';
import { Image as RNImage, View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const Image = ({ images, currentIndex, onRemove, isLandscape }) => {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleImagePress = () => {
    setIsEnlarged(!isEnlarged);
  };

  return (
    <View style={styles.imageWrapper}>
      <TouchableOpacity onPress={handleImagePress}>
        <RNImage source={{ uri: images[currentIndex].uri }} style={isLandscape ? styles.landscapeImage : styles.portraitImage}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(images[currentIndex].uri)}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
      {isEnlarged && (
        <Modal
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
    position: 'relative',
    marginTop: 10,
    marginRight: 5,
  },
  landscapeImage: {
    width: 125, // 25% bigger than 100
    height: 93.75, // 25% bigger than 75
    borderRadius: 4,
  },
  portraitImage: {
    width: 93.75, // 25% bigger than 75
    height: 125, // 25% bigger than 100
    borderRadius: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default Image;