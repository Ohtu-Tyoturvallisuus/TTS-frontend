import { StyleSheet, View, Text } from 'react-native';
import WorksitesList from './WorksitesList';

const Main = () => {

  return (
    <View style={styles.container}>
      <WorksitesList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 75,
  },
});

export default Main;