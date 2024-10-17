import { StyleSheet, View, Modal, Button } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-native';
import ProjectList from '@components/project-list/ProjectList';
import WorkSafetyForm from '@components/risk-form/RiskForm';
import SignIn from '@components/sign-in/SignIn';
import AppBar from '@components/app-bar/AppBar';
import Settings from './Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@contexts/UserContext';
import { useTranslation } from 'react-i18next';

const Main = () => {
  const { username, setUsername } = useContext(UserContext)
  const [settingsVisible, setSettingsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchUsername = () => {
      AsyncStorage.getItem('username')
        .then(storedUsername => {
          if (storedUsername) {
            setUsername(storedUsername)
          }
        })
        .catch(error => {
          console.error('Error retrieving username', error)
        })
    }
  
    fetchUsername()
  }, [setUsername])

  return (
    <View style={styles.container}>
      <AppBar username={username} setUsername={setUsername} openSettings={() => setSettingsVisible(true)} />
      <View style={styles.content}>
        <Routes>
          <Route path='/' element={
            <ProjectList /> 
          }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/worksafetyform' element={<WorkSafetyForm />}/>
        </Routes>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)} // Close the modal when back is pressed on Android
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Settings />
            <Button title={t('main.close')} onPress={() => setSettingsVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 10
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

export default Main;