import { useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import CloseButton from '@components/buttons/CloseButton';
import { retrieveImage, joinSurvey } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';
import FilledRiskNote from './FilledRiskNote';

const FilledRiskForm = ({
  formData = {},
  handleSubmit = null,
  projectName = '',
  projectId = '',
  task = null,
  scaffoldType = null,
  taskDesc = '',
  submitted = false,
  formattedDate = '',
  survey = {},
  joined = false,
  accessCode = null
}) => {
  const [modalVisible, setModalVisible] = useState(joined);
  const { t } = useTranslation(['translation', 'formFields']);
  const { accessToken, newUserSurveys, setNewUserSurveys, setJoinedSurvey } = useContext(UserContext);
  const [showExitModal, setShowExitModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState(false);

  const relevantRiskNotes = Object.entries(formData)
    .filter(([, value]) => value.status === 'checked');

  const handleClose = async (join = false) => {
    if (join) {
      setLoading(true)
      try {
        const response = await joinSurvey({ access_code: accessCode, accessToken })
        console.log('joinSurvey response:', response)
        setNewUserSurveys(!newUserSurveys)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setJoinError(true)
      }
    }
    if (joinError) {
      console.log('Showing error alert')
      Alert.alert(t('filledriskform.alert'))
    } else {
      console.log('Closing filled risk form modal')
      setJoinedSurvey(false)
      setModalVisible(false)
      if (joined) {
        Alert.alert(
          t('filledriskform.successTitle'),
          t('filledriskform.successInfo')
        )
      }
    }
  }

  const handleCloseWithoutConfirmation = () => {
    console.log('Closing filled risk form modal with no confirmation')
    setJoinedSurvey(false)
    setModalVisible(false)
  }

  return (
    <>
      {joined ? (<></>) : submitted ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-lg font-semibold">
            {t('filledriskform.project')}: {survey.project_name}
          </Text>
      
          <View className="flex flex-row items-center">
            <Text className="text-base">{t('filledriskform.filledat')}: </Text>
            <Ionicons name="calendar-outline" size={16} color="black" style={{ marginRight: 4 }} />
            <Text className="text-base text-gray-600 mr-4">
              {formattedDate.date}
            </Text>
      
            <Ionicons name="time-outline" size={16} color="black" style={{ marginRight: 4 }} />
            <Text className="text-base text-gray-600">
              {formattedDate.time}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-[#ef7d00] rounded-md justify-center items-center py-3 px-6 w-full my-2"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold text-lg">{t('filledriskform.preview')}</Text>
        </TouchableOpacity>
      )}
      <>
        <Modal visible={modalVisible} animationType='slide' onRequestClose={() => {submitted ? setShowExitModal(true) : handleCloseWithoutConfirmation()}} testID='modal'>
          <View className="flex items-center justify-center">
            <ScrollView 
              className="bg-white flex-grow p-5 w-full" 
              contentContainerStyle={{ paddingBottom: 30 }}
            >
              <Image
                source={require('../../../assets/telinekataja.png')}
                style={{ width: '100%', height: 150, resizeMode: 'contain' }}
              />

              {accessCode && (
                <View style={styles.accessCodeContainer}>
                  <Text className="text-lg font-bold py-2">{t('filledriskform.accessCode')}: {accessCode}</Text>
                </View>
              )}
  
              <Text className="text-lg font-bold py-2">{t('riskform.projectName')}:</Text>
              <Text>{projectName}</Text>
    
              <Text className="text-lg font-bold py-2">{t('riskform.projectId')}: </Text>
              <Text>{projectId}</Text>

              {task && task.length > 0 && (
                <>
                  <Text className="text-lg font-bold py-2">{t('riskform.task')}:</Text>
                  {task.map((item, index) => (
                    <Text key={index}>{t(`riskform.${item}`)}</Text>
                  ))}
                </>
              )}

              {scaffoldType && scaffoldType.length > 0 && (
                <>
                  <Text className="text-lg font-bold py-2">{t('riskform.scaffoldType')}:</Text>
                  {scaffoldType.map((item, index) => (
                    <Text key={index}>{t(`scaffoldTypes.${item}`)}</Text>
                  ))}
                </>
              )}

              {taskDesc && (
                <>
                  <Text className="text-lg font-bold py-2">{t('riskform.taskDescription')}:</Text>
                  <Text>{taskDesc}</Text>
                </>
              )}
  
              {
                submitted ? (
                  relevantRiskNotes.length > 0 ? (
                    relevantRiskNotes.map(([key, value]) => {
                      const variableToUse = joined ? value.note || '' : key || '';
                      const renderTitle = () => {
                        if (!variableToUse) return '';
                        return variableToUse.startsWith('riskform.otherScaffolding')
                          ? `${t(`${variableToUse.split(' ')[0]}`)} ${variableToUse.split(' ')[1]}`
                          : variableToUse.startsWith('riskform.otherEnvironment')
                            ? `${t(`${variableToUse.split(' ')[0]}`)} ${variableToUse.split(' ')[1]}`
                            : t(`${variableToUse}.title`, { ns: 'formFields' });
                      };
                    
                      return (
                        <FilledRiskNote
                          key={key}
                          renderTitle={renderTitle}
                          value={value}
                          modalVisible={modalVisible}
                          retrieveImage={retrieveImage}
                          submitted={submitted}
                        />
                      )
                    })
                  ) : (
                    <View className="py-3">
                      <View className="border p-3 rounded-md w-full">
                        <Text className="text-lg font-bold">
                          {t('filledriskform.emptyform')}
                        </Text>
                      </View>
                    </View>
                  )
                ) : (
                  relevantRiskNotes.length > 0 ? (
                    relevantRiskNotes.map(([key, value]) => {
                      const renderTitle = () => {
                        return key.startsWith('riskform.otherScaffolding')
                          ? `${t(`${key.split(' ')[0]}`)} ${key.split(' ')[1]}`
                          : key.startsWith('riskform.otherEnvironment')
                            ? `${t(`${key.split(' ')[0]}`)} ${key.split(' ')[1]}`
                            : t(`${key}.title`, { ns: 'formFields' });
                      };
                    
                      return (
                        <FilledRiskNote
                          key={key}
                          renderTitle={renderTitle}
                          value={value}
                          modalVisible={modalVisible}
                          retrieveImage={retrieveImage}
                          submitted={submitted}
                        />
                      );
                    })
                  ) : (
                    <View className="py-3">
                      <View className="border p-3 rounded-md w-full">
                        <Text className="text-lg font-bold">
                          {t('filledriskform.norisks')}
                        </Text>
                      </View>
                    </View>
                  )
                )
              }

              {submitted ?
                joined ? (
                  <View className='pt-5'>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => {
                        console.log('Hazard identification completed')
                        handleClose(true)
                      }}
                    >
                      <Text style={styles.buttonText}>{t('filledriskform.confirm')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmButton, {backgroundColor: '#D32F2F'}]}
                      onPress={() => {
                        setShowExitModal(true);
                      }}
                    >
                      <Text style={styles.buttonText}>{t('filledriskform.close')}</Text>
                    </TouchableOpacity>
                    <Modal
                      visible={showExitModal}
                      animationType='fade'
                      transparent
                      onRequestClose={() => setShowExitModal(false)}
                    >
                      <View style={styles.modalContainer}>
                        <View style={styles.container}>
                          <Text style={styles.header}>{t('filledriskform.closeInfo')}</Text>
                          <View style={styles.buttonContainer}>
                            <TouchableOpacity
                              onPress={() => setShowExitModal(false)}
                              style={[styles.confirmButton, {backgroundColor: 'white'}]}
                            >
                              <Text>{t('confirmation.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setShowExitModal(false)
                                handleCloseWithoutConfirmation()
                              }}
                              style={[styles.confirmButton, {backgroundColor: 'red'}]}
                            >
                              <Text style={styles.confirmButtonText}>{t('confirmation.confirm')}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                ) : (
                <CloseButton onPress={() => handleClose()} />
              ) : (
                <>
                  <TouchableOpacity
                    className="rounded-md py-3 my-2 items-center bg-orange mt-7"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-white text-lg font-bold">{t('filledriskform.edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="rounded-md py-3 my-2 items-center bg-[#008000]"
                    onPress={() => {
                      setModalVisible(false)
                      handleSubmit()
                    }}
                  >
                    <Text className="text-white text-lg font-bold">{t('riskform.submit')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
        <Modal visible={loading} animationType='fade'>
          <View style={styles.modalContainer}>
            <View style={styles.container}>
              <ActivityIndicator
                size='large'
                color='#ef7d00'
              />
              <Text className='self-center pt-2'>{t('filledriskform.confirming')}</Text>
            </View>
          </View>
        </Modal>
      </>
    </>
  )
};

const styles = StyleSheet.create({
  accessCodeContainer: {
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
  button: {
    borderColor: '#ef7d00',
    borderRadius: 5,
    borderWidth: 1,
    padding: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: '#388E3C',
    borderRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  confirmButtonText: {
    color: '#fff',
  },
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
})

export default FilledRiskForm;
