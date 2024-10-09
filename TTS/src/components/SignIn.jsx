import { TextInput, Pressable, View, StyleSheet, Text } from 'react-native';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { signIn } from '../services/apiService';


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

  const onSubmit = async (values) => {
    try {
      const data = await signIn(values.username);
      console.log(data);
      await AsyncStorage.setItem('username', values.username);
      setUsername(values.username);
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#0366d6',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 10,
    width: '90%',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
  input: {
    alignSelf: 'center',
    borderColor: '#e1e4e8',
    borderRadius: 5,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
});
