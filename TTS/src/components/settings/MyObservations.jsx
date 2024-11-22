import { useState } from 'react';
import { Text, Modal, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import SettingsButton from '@components/buttons/SettingsButton';
import CloseButton from '@components/buttons/CloseButton';
import FilledRiskForm from '@components/risk-form/FilledRiskForm';
import Loading from '@components/Loading';
import useUserSurveys from '@hooks/useUserSurveys';
import { formatDate } from '@utils/dateUtils';

const MyObservations = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userSurveys, loading, error } = useUserSurveys();
  const { t } = useTranslation();

  return (
    <>
      <SettingsButton 
        onPress={() => {
          setModalVisible(true)
        }}
        text={t('myobservations.title')}
      />
      <Modal
        testID='myobservations-modal'
        visible={modalVisible}
        animationType='fade'
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex items-center justify-center">
          <ScrollView
            className="bg-white flex-grow p-5 w-full" 
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Text className="text-xl font-bold mb-4" style={{ marginTop: 40 }}>
              {t('myobservations.title')}
            </Text>
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
            <Loading 
              loading={loading} 
              error={error} 
              title={t('myobservations.loading')}
            />
            <CloseButton onPress={() => setModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default MyObservations;