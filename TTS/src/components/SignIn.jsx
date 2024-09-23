import { TextInput, Pressable, View, StyleSheet, Text } from 'react-native';
import { useFormik } from 'formik';
import axios from 'axios';
import Constants from 'expo-constants';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
});

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Syötä käyttäjänimi'),
});

const initialValues = {
  username: '',
};

const SignIn = () => {
  const navigate = useNavigate()
  const { setUsername } = useContext(UserContext)
  const local_ip = Constants.expoConfig.extra.local_ip
  const onSubmit = (values) => {
    axios.post('http://' + local_ip + ':8000/api/signin/', {
      username: values.username
    })
      .then(response => {
        console.log(response.data)
        AsyncStorage.setItem('username', values.username)
          .then(() => {
            setUsername(values.username)
            navigate('/')
          })
      })
      .catch(error => console.error('Error signing in:', error))
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })
  const hasError = (field) =>
    formik.errors[field] && formik.touched[field];

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Käyttäjänimi"
        onChangeText={formik.handleChange('username')}
        value={formik.values.username}
        style={[
          styles.input,
          hasError('username') && styles.errorInput,
        ]}
      />
      {hasError('username') && (
        <Text style={styles.errorText}>
          {formik.errors.username}
        </Text>
      )}

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