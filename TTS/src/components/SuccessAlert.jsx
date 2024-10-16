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
      <View style={styles.alertContainer}>
        <Text style={styles.alertText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  alertContainer: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    transform: [{ translateY: -50 }], // Center vertically
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  alertText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SuccessAlert;