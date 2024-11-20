import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import CustomModal from '@components/CustomModal';
import CloseButton from '@components/buttons/CloseButton';

const InfoModal = ({ title }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation(['translation', 'formFields']);

  const handleModalVisibility = () => {
    setVisible(!visible);
  };

  return (
    <View>
      <TouchableOpacity
        testID="info-icon-button"
        className="min-h-12 min-w-12 p-2 items-center justify-center"
        onPress={handleModalVisibility}
      >
        <Ionicons name="information-circle-outline" size={32} color="black" />
      </TouchableOpacity>
      <CustomModal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalVisibility}
      >
        <View>
          { title.startsWith('riskform.otherScaffolding') || title.startsWith('riskform.otherEnvironment') ? (
            <Text className="text-xl my-5 ml-2">{t('descriptionmodal.otherHazards')}</Text>
          ) : (
            <Text className="text-xl my-5 ml-2">{t(`${title}.description`, { ns: 'formFields' })}</Text>
          )}
        </View>
        <CloseButton onPress={handleModalVisibility} />
      </CustomModal>
    </View>
  );
}

export default InfoModal;

