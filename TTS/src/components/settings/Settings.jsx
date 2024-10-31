import React, { useState, useContext, useEffect } from 'react';
import { Modal, StyleSheet, View, Text  } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { UserContext } from '@contexts/UserContext';
import ChangeLanguage from './ChangeLanguage';
import CloseButton from '@components/buttons/CloseButton';
import SettingsButton from '@components/buttons/SettingsButton';

const Settings = () => {
  const [changeLanguageVisible, setChangeLanguageVisible] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { username, setUsername, email, setEmail } = useContext(UserContext);

  const handleSignOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('username'),
        AsyncStorage.removeItem('email'),
        AsyncStorage.removeItem('access_token'),
      ]);

      setUsername(null);
      setEmail(null)
      console.log('User signed out, email and access_token removed');

      navigation.navigate('Main');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const getEmail = async () => {
    const mail = await AsyncStorage.getItem('email')
    await setEmail(mail)
  }

  useEffect(() => {
    getEmail()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{username}</Text>
      <Text style={styles.text}>{email}</Text>
      <SettingsButton
        onPress={() => setChangeLanguageVisible(true)}
        text={t('settings.changeLanguage')}
      />     
      {username ? (
        <SettingsButton
          onPress={handleSignOut}
          text={t('settings.signOut')}
        />
      ) : (
        <SettingsButton
          onPress={() => navigation.navigate('MicrosoftSignIn')}
          text={t('settings.signIn')}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changeLanguageVisible}
        onRequestClose={() => setChangeLanguageVisible(false)} // Close the modal when back is pressed on Android
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ChangeLanguage />
            <CloseButton onPress={() => setChangeLanguageVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#e1e4e8',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    width: '75%',
  },
  text: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Settings;