import { StyleSheet, Pressable, View, Text } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import AppBarTab from './AppBarTab';

const AppBar = ({ username, setUsername, openSettings }) => {
  const { t } = useTranslation();

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
        <AppBarTab text={t('appbar.projects')} to='/' />
        <Pressable onPress={openSettings}>{/* Opens the settings modal */}
          <Text style={styles.text}>{t('appbar.settings')}</Text>
        </Pressable>
        {username ? (
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.text}>{t('appbar.signOut')}</Text>
          </Pressable>
        ) : (
          <AppBarTab text={t('appbar.signIn')} to='signin' />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default AppBar;