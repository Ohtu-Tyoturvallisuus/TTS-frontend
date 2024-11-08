import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

const LoadingErrorComponent = ({ loading, error, title }) => {
  const { t } = useTranslation();

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
        <Text style={styles.errorText}>{t('loading.error')}</Text>
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
    backgroundColor: 'white',
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
    backgroundColor: 'white',
  },
  loadingText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoadingErrorComponent;