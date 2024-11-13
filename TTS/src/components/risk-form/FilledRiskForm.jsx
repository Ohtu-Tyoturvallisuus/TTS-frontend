import { useState } from "react";
import { View, ScrollView, Text, Image, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import RiskImage from "@components/take-picture/Image";

const FilledRiskForm = ({
  formData = {},
  handleSubmit = null,
  projectName = '',
  projectId = '',
  task = null,
  scaffoldType = null,
  taskDesc = null
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation(['translation', 'formFields']);

  const relevantRiskNotes = Object.entries(formData)
    .filter(([, value]) => value.status === 'checked');

  return (
    <>
      <TouchableOpacity
        className="bg-[#ef7d00] rounded-md justify-center items-center py-3 px-6 w-full my-2"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold text-lg">{t('filledriskform.preview')}</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType='slide'>
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

            {relevantRiskNotes.length > 0 ? (
              relevantRiskNotes.map(([key, value]) => (
                <View key={key} className="py-2">
                  <Text className="text-base font-bold">
                    {t(`${key}.title`, { ns: 'formFields' })}:
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
                        <RiskImage
                          key={index}
                          images={value.images}
                          currentIndex={index}
                          isLandscape={image.isLandscape}
                          testID={`risk-image-${index}`}
                        />
                      ))
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View className="py-3">
                <View className="border p-3 rounded-md w-full">
                  <Text className="text-lg font-bold">{t('filledriskform.norisks')}</Text>
                </View>
              </View>
            )}
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
          </ScrollView>
        </View>
      </Modal>
    </>
  )
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
  },
})

export default FilledRiskForm;
