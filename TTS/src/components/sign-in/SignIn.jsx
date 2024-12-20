
import { useState } from 'react';
import {
  TextInput,
  View,
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
  const { setUsername, setAccessToken, setIsGuest } = useContext(UserContext);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); 

  const validationSchema = yup.object().shape({
    first_name: yup.string().required(t('signin.error_first_name')),
    last_name: yup.string().required(t('signin.error_last_name')),
  });
  
  const initialValues = {
    first_name: '',
    last_name: '',
  };

  const onSubmit = async (values) => {
    if (loading) return; 

    setLoading(true); 
    try {
      const username = `${values.first_name} ${values.last_name}`;
      const data = await signIn(username, null, true);
      console.log(data);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('is_guest', 'true');
      setUsername(username);
      setAccessToken(data.access_token);
      setIsGuest(true);
      setModalVisible(false); // Close modal after successful sign-in
      navigation.navigate('Settings');
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
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
      <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-black rounded-lg justify-center items-center py-4 px-6 my-2 w-64">
        <Text className="text-white font-bold">{t('signin.guestSignInButton')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <View className="pb-3">
              <Text className="pb-1">{t('signin.first_name')}</Text>
              <TextInput
                placeholder={t('signin.first_name')}
                placeholderTextColor="#A9A9A9"
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

            <View className="pb-3">
              <Text className="pb-1">{t('signin.last_name')}</Text>
              <TextInput
                placeholder={t('signin.last_name')}
                placeholderTextColor="#A9A9A9"
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

            <TouchableOpacity
              onPress={formik.handleSubmit}
              className={`bg-orange rounded-lg justify-center items-center py-4 px-6 my-2 ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              <Text className="text-white font-bold">
                {loading ? t('signin.loading') : t('signin.confirmLogin')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-[#808080] rounded-lg justify-center items-center py-4 px-6 my-2">
              <Text className="text-white font-bold">{t('signin.close')}</Text>
            </TouchableOpacity>
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
