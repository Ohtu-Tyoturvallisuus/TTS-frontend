import React from 'react';
import { Image as RNImage, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Image = ({ uri, onRemove, isLandscape }) => {
  return (
    <View style={styles.imageWrapper}>
      <RNImage source={{ uri }} style={isLandscape ? styles.landscapeImage : styles.portraitImage}/>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
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
    width: 100,
    height: 75,
    borderRadius: 4,
  },
  portraitImage: {
    width: 75,
    height: 100,
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
    fontWeight: 'bold',
  },
});

export default Image;