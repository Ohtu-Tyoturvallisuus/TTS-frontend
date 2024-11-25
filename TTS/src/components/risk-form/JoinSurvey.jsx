import { useState, useContext } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getSurveyByAccessCode } from '@services/apiService';
import FilledRiskForm from './FilledRiskForm';
import { UserContext } from '@contexts/UserContext';

const JoinSurvey = ({visible=true}) => {
  const { t } = useTranslation();
  const [setModalVisible] = useState(visible);
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
      <View className = "items-center bg-white">
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
        </View>
      </View>
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
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: '100%',
    padding: 20,
    width: '100%',
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
});

export default JoinSurvey;