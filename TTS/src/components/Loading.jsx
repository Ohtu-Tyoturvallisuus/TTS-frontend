import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

const LoadingErrorComponent = ({ loading, error, title }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="activity-indicator" size="large" color="#ef7d00" />
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
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
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