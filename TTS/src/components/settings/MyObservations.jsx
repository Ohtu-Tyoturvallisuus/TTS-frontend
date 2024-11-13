import { useEffect, useState } from 'react';
import { Text, Modal, View, ScrollView } from 'react-native';
import SettingsButton from '@components/buttons/SettingsButton';
import CloseButton from '@components/buttons/CloseButton';
import { getUserSurveys } from '@services/apiService';

const MyObservations = () => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserSurveys = async () => {
      await getUserSurveys()
    }
    fetchUserSurveys()
  }, [])

  return (
    <>
      <SettingsButton 
        onPress={() => setModalVisible(true)}
        text={'My observations'}
      />
      <Modal visible={modalVisible} animationType='fade'>
        <View className="flex items-center justify-center">
          <ScrollView
            className="bg-white flex-grow p-5 w-full" 
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Text>Hello world</Text>
            <CloseButton onPress={() => setModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

export default MyObservations;