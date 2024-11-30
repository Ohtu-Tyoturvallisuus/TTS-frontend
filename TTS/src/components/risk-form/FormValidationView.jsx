import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useFormContext } from '@contexts/FormContext';
import { useTranslationLanguages } from '@contexts/TranslationContext';
import { useTranslation } from 'react-i18next';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import FilledRiskForm from './FilledRiskForm';
import { getAccountsBySurvey } from '@services/apiService';
import SuccessAlert from '@components/SuccessAlert';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '@contexts/UserContext';
import { NavigationContext } from '@contexts/NavigationContext';

const FormValidationView = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['translation', 'formFields']);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { newUserSurveys, setNewUserSurveys } = useContext(UserContext);
  const { setCurrentLocation } = useContext(NavigationContext);
  const navigation = useNavigation();

  const {
    selectedProject: project,
    selectedSurveyId: surveyId,
    resetProjectAndSurvey
  } = useContext(ProjectSurveyContext);
  console.log('ID: ', surveyId);

  const {
    formData,
    updateFormField,
    replaceFormData,
    accessCode,
    task,
    scaffoldType,
    taskDesc,
  } = useFormContext();
  console.log(accessCode);
  const { fromLang, toLangs } = useTranslationLanguages();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await getAccountsBySurvey(surveyId);
        console.log('Response: ', response);
        setAccounts(response.accounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };
    // Initial fetch
    fetchAccounts();

    // Set up polling interval
    const interval = setInterval(fetchAccounts, 10000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [surveyId]);

  const handleConfirmation = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setShowSuccessAlert(true);
  };

  return (
    <View className="flex-1 bg-white p-5">
    <ScrollView>
      <View style={styles.accessCodeContainer}>
        <Text className="text-lg<">
          {t('filledriskform.accessCode')}:
        </Text>
        <Text style={styles.accessCode}>
          {accessCode}
        </Text>
      </View>

      <View>
        <Text className="text-lg font-bold mt-4">
          {t('formvalidation.participants')} ({accounts.length})
        </Text>
        {accounts.map(({ account, filled_at }) => (
          <View key={account.user_id} className="py-1 flex-row justify-between">
            <Text>{account.username}</Text>
            <Text>{new Date(filled_at).toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <FilledRiskForm
        formData={formData}
        handleSubmit={() => {}}
        projectName={project.project_name}
        projectId={project.project_id}
        task={task}
        scaffoldType={scaffoldType}
        taskDesc={taskDesc}
        inspectOnly={true}
      />
      <TouchableOpacity
        className="rounded-md py-3 my-2 items-center bg-[#008000]"
        onPress={handleConfirmation}
      >
        <Text className="text-white text-lg align-middle font-bold">
          Merkitse valmiiksi
        </Text>
      </TouchableOpacity>
    </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white p-5 rounded-lg m-5">
            <Text className="text-lg mb-4">
              {t('formvalidation.participants')}: {accounts.length}{'\n'}
              {t('formvalidation.confirmMessage')}
            </Text>
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="bg-gray-500 px-4 py-2 rounded"
              >
                <Text className="text-white">{t('formvalidation.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-[#008000] px-4 py-2 rounded"
              >
                <Text className="text-white">{t('formvalidation.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert
          message={t('formvalidation.successMessage')}
          onDismiss={() => {
            navigation.replace('ProjectList');
            setNewUserSurveys(!newUserSurveys);
            setCurrentLocation('ProjectList');
            resetProjectAndSurvey();
          }}
        />
      )}
  </View>
  );
}

const styles = StyleSheet.create({
  accessCodeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#6f7072',
    borderRadius: 5,
    borderWidth: 1,
    elevation: 2,
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  accessCode: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5
  }
});

export default FormValidationView;
