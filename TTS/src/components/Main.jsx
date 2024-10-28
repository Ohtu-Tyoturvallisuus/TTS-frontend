import { View } from 'react-native';
import React, { useEffect, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-native';
import ProjectList from '@components/project-list/ProjectList';
import WorkSafetyForm from '@components/risk-form/RiskForm';
import SignIn from '@components/sign-in/SignIn';
import AppBar from '@components/app-bar/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@contexts/UserContext';

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
    <View className="bg-[#e1e4e8] flex-1 justify-center">
      <AppBar username={username} setUsername={setUsername} />
      <View className="flex-1">
        <Routes>
          <Route path='/' element={
            <>
              <ProjectList/> 
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

export default Main;