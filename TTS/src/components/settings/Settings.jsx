import React, { useState, useContext } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View  } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { UserContext } from '@contexts/UserContext';
import ChangeLanguage from './ChangeLanguage';
import CloseButton from '@components/buttons/CloseButton';

const Settings = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { username, setUsername } = useContext(UserContext);

  const handleSignOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('username'),
        AsyncStorage.removeItem('access_token'),
      ]);

      setUsername(null);
      console.log('User signed out and access_token removed');

      navigation.navigate('Main');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSettingsVisible(true)}
      >     
        <Text style={styles.buttonText}>{t('settings.changeLanguage')}</Text>
      </TouchableOpacity>
      {username ? (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignOut}
        >     
          <Text style={styles.buttonText}>{t('settings.signOut')}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MicrosoftSignIn')}
        >     
          <Text style={styles.buttonText}>{t('settings.signIn')}</Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)} // Close the modal when back is pressed on Android
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ChangeLanguage />
            <CloseButton onPress={() => setSettingsVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,    
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#e1e4e8',
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
});

export default Settings;