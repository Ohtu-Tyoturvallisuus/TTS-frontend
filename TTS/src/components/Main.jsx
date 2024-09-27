import { StyleSheet, View, Text, Button } from 'react-native';
import React, { useEffect, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-native';
import WorksitesList from './WorksitesList';
import WorkSafetyForm from './risk_form/WorkSafetyForm';
import SignIn from './SignIn';
import AppBar from './AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contexts/UserContext';
import RiskFormButton from './risk_form/RiskFormButton';
import { useLocation } from 'react-router-native';

const Main = () => {
  const { username, setUsername } = useContext(UserContext)
  const location = useLocation().pathname

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
      {username && location !== '/worksafetyform' ? (<RiskFormButton />) : (<></>)}
      <View style={styles.content}>
        <Routes>
          <Route path='/' element={<WorksitesList />} />
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
    flex: 1,
    backgroundColor: '#e1e4e8',
    justifyContent: 'center',
  },
  content: {
    flex: 10
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Main;