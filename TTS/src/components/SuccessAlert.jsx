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
  alertContainer: {
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 10,
    justifyContent: 'center',
    left: '10%',
    padding: 15,
    position: 'absolute',
    right: '10%',
    top: '50%',
    transform: [{ translateY: -50 }], 
    zIndex: 1000,
  },
  alertText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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