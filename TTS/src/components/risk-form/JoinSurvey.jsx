import { useState, useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, Modal, View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CloseButton from '@components/buttons/CloseButton';
import { getSurveyByAccessCode } from '@services/apiService';
import FilledRiskForm from './FilledRiskForm';
import { UserContext } from '@contexts/UserContext';

const JoinSurvey = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [survey, setSurvey] = useState(null);
  const { joinedSurvey, setJoinedSurvey } = useContext(UserContext);
  const [accessCode, setAccessCode] = useState('');

  const validationSchema = yup.object().shape({
    access_code: yup.string()
      .required(t('joinsurvey.error'))
      .length(6, t('joinsurvey.error_length')),
  });
  
  const initialValues = {
    access_code: ''
  };

  const onSubmit = async (values, { resetForm }) => {
    setModalVisible(false)
    const data = await getSurveyByAccessCode(values.access_code)
    setAccessCode(values.access_code)
    setSurvey(data)
    setModalVisible(false)
    setJoinedSurvey(true)
    resetForm()
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const hasError = (field) => formik.errors[field] && formik.touched[field];

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{t('joinsurvey.join')}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType='fade'
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>{t('joinsurvey.insertCode')}</Text>
            <TextInput
                placeholder={t('joinsurvey.insertPlaceholder')}
                placeholderTextColor="#A9A9A9"
                onChangeText={formik.handleChange('access_code')}
                value={formik.values.access_code}
                style={[
                  styles.input,
                  hasError('access_code') && styles.errorInput,
                ]}
              />
              {hasError('access_code') && (
                <Text className="text-[#FF0000]">{formik.errors.access_code}</Text>
              )}
              <TouchableOpacity
                onPress={formik.handleSubmit}
                className={`bg-orange rounded-lg justify-center items-center py-4 px-6 my-2`}
              >
                <Text className="text-white font-bold">{t('joinsurvey.join')}</Text>
              </TouchableOpacity>
              <CloseButton onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {joinedSurvey &&
        <FilledRiskForm
          submitted={true}
          survey={survey}
          formData={survey.risk_notes}
          projectName={survey.project_name}
          projectId={survey.project_id}
          taskDesc={survey.description}
          scaffoldType={survey.scaffold_type}
          task={survey.task}
          joined={true}
          accessCode={accessCode}
        />
      }
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#ef7d00',
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
    padding: 15,
    width: '75%'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10
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
});

export default JoinSurvey;