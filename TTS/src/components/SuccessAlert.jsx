import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SuccessAlert = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) {
        onDismiss();
      }
    }, 3000); // Show alert for 3 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <View style={styles.backdrop}>
      <View className="absolute left-10 right-10 top-1/2 transform -translate-y-1/2 z-1000 p-4 bg-[#008000] rounded-lg">
      <Text className="text-white text-2xl font-bold text-center">{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
  },
});

export default SuccessAlert;