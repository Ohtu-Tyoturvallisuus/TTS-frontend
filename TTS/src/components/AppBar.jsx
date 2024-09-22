import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contexts/UserContext';

import AppBarTab from './AppBarTab';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#24292e',
    width: '100%',
    alignSelf: 'flex-start',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '700',
  },
  signOutButton: {
    borderRadius: 10,
  },
});

const AppBar = () => {
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
  
  const handleSignOut = () => {
    AsyncStorage.removeItem('username')
      .then(() => {
        setUsername(null)
        console.log('User signed out')
      })
      .catch(error => {
        console.error('Error signing out:', error)
      })
  }

  return (
    <Pressable style={styles.container}>
      <View style={styles.buttons}>
        <AppBarTab text='Työmaat' to='/' />
        {username ? (
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.text}>Kirjaudu ulos</Text>
          </Pressable>
        ) : (
          <AppBarTab text='Kirjaudu sisään' to='signin' />
        )}
      </View>
    </Pressable>
  );
};

export default AppBar;