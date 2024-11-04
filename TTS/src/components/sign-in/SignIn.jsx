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

const SignIn = () => {
  const navigation = useNavigation();
  const { setUsername } = useContext(UserContext);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const validationSchema = yup.object().shape({
    first_name: yup.string().required(t('signin.error_first_name')),
    last_name: yup.string().required(t('signin.error_last_name')),
  });
  
  const initialValues = {
    first_name: '',
    last_name: '',
  };

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
        <Text className="text-white font-bold">{t('signin.guestSignInButton')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <View className="pb-3">
              <TextInput
                placeholder={t('signin.first_name')}
                placeholderTextColor="#C0C0C0"
                onChangeText={formik.handleChange('first_name')}
                value={formik.values.first_name}
                style={[
                  styles.input,
                  hasError('first_name') && styles.errorInput,
                ]}
              />
              {hasError('first_name') && (
                <Text className="text-[#FF0000]">{formik.errors.first_name}</Text>
              )}
            </View>
            <View>
              <TextInput
                placeholder={t('signin.last_name')}
                placeholderTextColor="#C0C0C0"
                onChangeText={formik.handleChange('last_name')}
                value={formik.values.last_name}
                style={[
                  styles.input,
                  hasError('last_name') && styles.errorInput,
                ]}
              />
              {hasError('last_name') && (
                <Text className="text-[#FF0000]">{formik.errors.last_name}</Text>
              )}
            </View>

            <Pressable onPress={formik.handleSubmit} className="bg-orange rounded-lg justify-center items-center py-4 px-6 my-2">
              <Text className="text-white font-bold">{t('signin.confirmLogin')}</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} className="bg-[#808080] rounded-lg justify-center items-center py-4 px-6 my-2">
              <Text className="text-white font-bold">{t('signin.close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  errorInput: {
    borderColor: 'red',
  },
  input: {
    borderColor: '#e1e4e8',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
