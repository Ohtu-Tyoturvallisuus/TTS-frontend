import React, { useState, useContext, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, Alert  } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { UserContext } from '@contexts/UserContext';
import ChangeLanguage from './ChangeLanguage';
import CloseButton from '@components/buttons/CloseButton';
import SettingsButton from '@components/buttons/SettingsButton';
import MyObservations from './MyObservations';

const Settings = () => {
  const [changeLanguageVisible, setChangeLanguageVisible] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { username, setUsername, email, setEmail, isGuest, setIsGuest } = useContext(UserContext);

  const handleSignOut = async () => {
    try {
      if (isGuest) {
        console.log('Signing out as a guest...');
        setUsername(null);
        setIsGuest(false);
        navigation.navigate('Main');
      } else {
        await Promise.all([
          AsyncStorage.removeItem('username'),
          AsyncStorage.removeItem('email'),
          AsyncStorage.removeItem('access_token'),
        ]);
  
        setUsername(null);
        setEmail(null);
        setIsGuest(false);
        console.log('User signed out, email, access_token removed and isGuest reset');
        navigation.navigate('Main');
      }
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const confirmSignOut = () => {
    if (isGuest) {
      Alert.alert(
        t('settings.signOutGuestAlertTitle'),
        t('settings.signOutGuestAlertMessage'),
        [
          { text: t('settings.cancel'), style: 'cancel' },
          { text: t('settings.confirm'), onPress: handleSignOut },
        ],
        { cancelable: true }
      );
    } else {
      handleSignOut();
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
      {username && <MyObservations />}
      <SettingsButton
        onPress={() => setChangeLanguageVisible(true)}
        text={t('settings.changeLanguage')}
      />     
      {username ? (
        <SettingsButton
          onPress={confirmSignOut}
          text={t('settings.signOut')}
        />
      ) : (
        <SettingsButton
          onPress={() => navigation.navigate('CombinedSignIn')}
          text={t('settings.signIn')}
        />
      )}
      <Modal
        testID='change-language-modal'
        animationType="fade"
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
    backgroundColor: 'white',
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