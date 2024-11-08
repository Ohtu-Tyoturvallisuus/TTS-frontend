import { StyleSheet, Pressable, View, Text } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native'; 

import AppBarTab from './AppBarTab';

const AppBar = ({ username, setUsername, openSettings }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('username'),
        AsyncStorage.removeItem('access_token'),
      ]);

      setUsername(null);
      console.log('User signed out and access_token removed');

      navigation.navigate('Main');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

export default AppBar;