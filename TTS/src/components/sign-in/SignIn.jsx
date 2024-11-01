import { useState } from 'react';
import {
  TextInput,
  View,
  Pressable,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity
} from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '@contexts/UserContext';
import { signIn } from '@services/apiService';

const validationSchema = yup.object().shape({
  first_name: yup.string().required('Syötä etunimi'),
  last_name: yup.string().required('Syötä sukunimi'),
});

const initialValues = {
  first_name: '',
  last_name: '',
};

const SignIn = () => {
  const navigation = useNavigation();
  const { setUsername } = useContext(UserContext);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = async (values) => {
    try {
      const username = `${values.first_name} ${values.last_name}`
      const data = await signIn(username, null, true);
      console.log(data);
      await AsyncStorage.setItem('username', username);
      setUsername(username);
      setModalVisible(false); // Close modal after successful sign-in
      navigation.navigate('Settings');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const hasError = (field) => formik.errors[field] && formik.touched[field];

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-orange rounded-lg justify-center items-center py-4 px-6 my-2">
        <Text style={styles.buttonText}>{t('signin.guestSignInButton')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <TextInput
              placeholder={t('signin.first_name')}
              onChangeText={formik.handleChange('first_name')}
              value={formik.values.first_name}
              style={[
                styles.input,
                hasError('first_name') && styles.errorInput,
              ]}
            />
            {hasError('first_name') && (
              <Text style={styles.errorText}>{formik.errors.first_name}</Text>
            )}
            <TextInput
              placeholder={t('signin.last_name')}
              onChangeText={formik.handleChange('last_name')}
              value={formik.values.last_name}
              style={[
                styles.input,
                hasError('last_name') && styles.errorInput,
              ]}
            />

            <Pressable onPress={formik.handleSubmit} className="bg-[#ef7d00] rounded-lg justify-center items-center py-4 px-6 my-2">
              <Text style={styles.buttonText}>{t('signin.confirmLogin')}</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{t('signin.close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#0366d6',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  input: {
    borderColor: '#e1e4e8',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0366d6',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
