import { StyleSheet, View, Text } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';

import WorksitesList from './WorksitesList';
import WorkSafetyForm from './WorkSafetyForm';
import SignIn from './SignIn';
import AppBar from './AppBar';

const Main = () => {


  return (
    <View style={styles.container}>
      <AppBar />
      <WorkSafetyForm />
      <View style={styles.content}>
        <Routes>
          <Route path='/' element={<WorksitesList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path='/signin' element={<SignIn />} />
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
    flex: 1
  }
});

export default Main;