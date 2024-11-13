import { useEffect, useState } from 'react';
import { Text, Modal, View, ScrollView } from 'react-native';
import SettingsButton from '@components/buttons/SettingsButton';
import CloseButton from '@components/buttons/CloseButton';
import { getUserSurveys } from '@services/apiService';
import { useTranslation } from 'react-i18next';
import FilledRiskForm from '@components/risk-form/FilledRiskForm';

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return {
    date: `${day}.${month}.${year}`,
    time: `${hours}:${minutes}`,
  };
};

const MyObservations = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userSurveys, setUserSurveys] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserSurveys = async () => {
      const response = await getUserSurveys();
      setUserSurveys(response.filled_surveys);
    }
    fetchUserSurveys();
  }, []);

  return (
    <>
      <SettingsButton 
        onPress={() => setModalVisible(true)}
        text={t('myobservations.title')}
      />
      <Modal visible={modalVisible} animationType='fade'>
        <View className="flex items-center justify-center">
          <ScrollView
            className="bg-white flex-grow p-5 w-full" 
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Text className="text-xl font-bold mb-4">{t('myobservations.title')}</Text>
            {userSurveys.map((survey) => {
              const formattedDate = formatDate(survey.created_at);
              return (
                <View key={survey.id} className="mb-3">
                  <FilledRiskForm
                    submitted={true}
                    formattedDate={formattedDate}
                    survey={survey}
                    formData={survey.risk_notes}
                    projectName={survey.project_name}
                    projectId={survey.project_id}
                    taskDesc={survey.description}
                    scaffoldType={survey.scaffold_type}
                    task={survey.task}
                  />
                </View>
              );
            })}
            <CloseButton onPress={() => setModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default MyObservations;