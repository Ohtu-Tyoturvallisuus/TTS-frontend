import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingErrorComponent = ({ loading, error, title }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="activity-indicator" size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>{title}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virhe lataamisessa</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoadingErrorComponent;