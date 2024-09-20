import { StyleSheet, Pressable, View } from 'react-native';
import Constants from 'expo-constants';

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
});

const AppBar = () => {
  return (
    <Pressable style={styles.container}>
      <View style={styles.buttons}>
        <AppBarTab text='Työmaat' to='/' />
        <AppBarTab text='Kirjaudu sisään' to='signin' />
      </View>
    </Pressable>
  );
};

export default AppBar;