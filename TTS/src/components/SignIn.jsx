import { TextInput, Pressable, View, StyleSheet, Text } from 'react-native';
import { useFormik } from 'formik';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    gap: 10,
    paddingVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    padding: 10,
  },
  button: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#0366d6',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const initialValues = {
  username: '',
};

const SignIn = () => {
  // TODO: Communicate submit with backend
  const onSubmit = (values) => {
    console.log('Tried to sign in with username ' + values.username)
  }
  const formik = useFormik({
    initialValues,
    onSubmit,
  })

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Käyttäjänimi"
        onChangeText={formik.handleChange('username')}
        value={formik.values.username}
      />

      <Pressable
        onPress={formik.handleSubmit}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Kirjaudu sisään</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;