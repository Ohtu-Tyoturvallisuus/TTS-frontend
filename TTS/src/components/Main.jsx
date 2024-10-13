import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-native';
import ProjectList from './ProjectList';
import WorkSafetyForm from './risk_form/WorkSafetyForm';
import SignIn from './SignIn';
import AppBar from './AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contexts/UserContext';
import SpeechToTextView from './SpeechToTextView';

const Main = () => {
  const { username, setUsername } = useContext(UserContext)

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
      <AppBar username={username} setUsername={setUsername} />
      <View style={styles.content}>
        <Routes>
          <Route path='/' element={
            <>
              <Text style={styles.sub_title}>Text-to-speech demo:</Text>
              <SpeechToTextView />
              <ProjectList /> 
            </>
          }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/worksafetyform' element={<WorkSafetyForm />}/>
        </Routes>
      </View>
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
  sub_title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  }
});

export default Main;