import { StyleSheet, Pressable, View, Text } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppBarTab from './AppBarTab';

const styles = StyleSheet.create({
  buttons: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    alignSelf: 'flex-start',
    backgroundColor: '#24292e',
    paddingBottom: 15,
    paddingHorizontal: 10,
    paddingTop: Constants.statusBarHeight,
    width: '100%',
  },
  signOutButton: {
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontFamily: 'System',
    fontSize: 16,   
    fontWeight: '700',
  },
});

const AppBar = ({ username, setUsername }) => {

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