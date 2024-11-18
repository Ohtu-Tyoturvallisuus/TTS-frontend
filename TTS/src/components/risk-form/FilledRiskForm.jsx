import { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import RiskImage from '@components/take-picture/Image';
import { Ionicons } from '@expo/vector-icons';
import CloseButton from '@components/buttons/CloseButton';
import { retrieveImage } from '@services/apiService';

const FilledRiskForm = ({
  formData = {},
  handleSubmit = null,
  projectName = '',
  projectId = '',
  task = null,
  scaffoldType = null,
  taskDesc = null,
  submitted = false,
  formattedDate = '',
  survey = {}
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation(['translation', 'formFields']);

  const relevantRiskNotes = Object.entries(formData)
    .filter(([, value]) => value.status === 'checked');

  return (
    <>
      {submitted ? (
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
        <Modal visible={modalVisible} animationType='slide' onRequestClose={() => setModalVisible(false)} testID='modal'>
          <View className="flex items-center justify-center">
            <ScrollView 
              className="bg-white flex-grow p-5 w-full" 
              contentContainerStyle={{ paddingBottom: 30 }}
            >
              <Image
                source={require('../../../assets/telinekataja.png')}
                style={{ width: '100%', height: 150, resizeMode: 'contain' }}
              />
  
              <Text className="text-lg font-bold py-2">{t('riskform.projectName')}:</Text>
              <Text>{projectName}</Text>
    
              <Text className="text-lg font-bold py-2">{t('riskform.projectId')}: </Text>
              <Text>{projectId}</Text>
              {task && (
                <>
                  <Text className="text-lg font-bold py-2">{t('riskform.task')}:</Text>
                  <Text>{t(`riskform.${task}`)}</Text>
                </>
              )}
              {scaffoldType && (
                <>
                  <Text className="text-lg font-bold py-2">{t('riskform.scaffoldType')}:</Text>
                  <Text>{t(`riskform.${scaffoldType}`)}</Text>
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
                      const renderTitle = () => {
                        return key.startsWith('riskform.otherScaffolding')
                          ? `${t(`${key.split(' ')[0]}`)} ${key.split(' ')[1]}`
                          : key.startsWith('riskform.otherEnvironment')
                            ? `${t(`${key.split(' ')[0]}`)} ${key.split(' ')[1]}`
                            : t(`${key}.title`, { ns: 'formFields' });
                      };
                    
                      const [retrievedImages, setRetrievedImages] = useState([]);
                    
                      useEffect(() => {
                        const fetchImages = async () => {
                          const images = await Promise.all(
                            value.images?.map(async (image) => {
                              const uri = await retrieveImage(image.blobName);
                              return { uri };
                            }) || []
                          );
                          setRetrievedImages(images);
                        };
                        modalVisible && fetchImages();
                      }, [value.images, modalVisible]);
                    
                      return (
                        <View key={key} className="py-2">
                          <Text className="text-base font-bold">
                            {renderTitle()}:
                          </Text>
                          <Text>
                            {value.description}
                          </Text>
                          {value.images.length > 0 ? (
                            <View style={styles.imageContainer}>
                            {!retrievedImages.length ? (
                              <View style={{ margin: 10 }}>
                                <Text>{t('filledriskform.loadingimages')}</Text>
                              </View>
                            ) : (
                              retrievedImages.map((retrievedImage, index) => (
                                <View key={index}>
                                  <RiskImage
                                    key={index}
                                    images={retrievedImages}
                                    currentIndex={index}
                                    isLandscape={value.images[index]?.isLandscape}
                                    testID={`risk-image-${index}`}
                                  />
                                </View>
                              ))
                            )}
                          </View>
                          ) : (
                            <View style={{ margin: 10 }}></View>
                          )}
                        </View>
                      );
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
                        <View key={key} className="py-2">
                          <Text className="text-base font-bold">
                            {renderTitle()}:
                          </Text>
                          <Text>
                            {value.description}
                          </Text>
                          <View style={styles.imageContainer}>
                            {!value.images ? (
                              <View style={{ margin: 10 }}>
                              </View>
                            ) : (
                              value.images.map((image, index) => (
                                <View key={index}>
                                  <RiskImage
                                    key={index}
                                    images={value.images}
                                    currentIndex={index}
                                    isLandscape={image.isLandscape}
                                    testID={`risk-image-${index}`}
                                  />
                                </View>
                              ))
                            )}
                          </View>
                        </View>
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
  
            
              {submitted ? (
                <CloseButton onPress={() => setModalVisible(false)} />
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
      </>
    </>
  )
};

const styles = StyleSheet.create({
  button: {
    borderColor: '#ef7d00',
    borderRadius: 5,
    borderWidth: 1,
    padding: 5
  },
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
  },
})

export default FilledRiskForm;
