import { StyleSheet, View, Text, Button } from 'react-native';
import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-native';
import WorksitesList from './WorksitesList';
import WorkSafetyForm from './risk_form/WorkSafetyForm';
import SignIn from './SignIn';
import AppBar from './AppBar';
import { UserProvider } from '../contexts/UserContext';

const Main = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <UserProvider>
        <AppBar />
        <Button 
          title="Täytä Työturvallisuuslomake" 
          onPress={() => setModalVisible(true)} 
          style={styles.button} 
        />
        {modalVisible && <WorkSafetyForm />}
        <View style={styles.content}>
          <Routes>
            <Route path='/' element={<WorksitesList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path='/signin' element={<SignIn />} />
          </Routes>
        </View>
      </UserProvider>
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
    flex: 1
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Main;