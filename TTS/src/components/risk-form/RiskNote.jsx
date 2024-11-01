import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import RiskModal from './RiskModal';

const RiskNote = ({ title, renderTitle, initialStatus, initialDescription, riskType, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [description, setDescription] = useState(initialDescription);
  const [isModification, setIsModification] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const handleModalSubmit = (newDescription) => {
    setModalVisible(false);
    setStatus('checked');
    setDescription(newDescription);
    onChange(title, 'description', newDescription);
    onChange(title, 'status', 'checked');
    onChange(title, 'risk_type', riskType);
  };

  const handleEditPress = () => {
    setIsModification(true);
    setModalVisible(true);
  };

  const handleReset = () => {
    console.log('Resetoidaan riski:', title);
    setIsModification(false);
    setStatus('');
    setDescription('');
    onChange(title, 'description', '');
    onChange(title, 'status', '');
    onChange(title, 'risk_type', riskType);
    setModalVisible(false);
  };

  return (
    <View testID={`risknote-${title}`}>
      <Text className="self-center text-base font-bold my-2">{renderTitle ? renderTitle(title) : title}</Text>
      {status === 'checked' ? (
        <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1 items-center justify-center">
          <Text className="self-center text-[#008000] text-base font-bold my-2">{t('risknote.checked')}</Text>
          </View>
          <TouchableOpacity
            className="absolute right-0 w-10 h-10 items-center justify-center border border-light-grey rounded-lg"
            onPress={handleEditPress}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      ) : status === 'notRelevant' ? (
        <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1 items-center justify-center">
          <Text className="self-center text-light-grey text-base font-bold my-2">{t('risknote.notRelevant')}</Text>
          </View>
          <TouchableOpacity
            className="absolute right-0 w-10 h-10 items-center justify-center border border-light-grey rounded-lg"
            onPress={handleEditPress}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row justify-between mb-2">
          <TouchableOpacity
            className="flex-1 items-center justify-center mx-1 py-2 border border-light-grey rounded-lg"
            onPress={() => {
              setStatus('notRelevant');
              onChange(title, 'status', 'notRelevant');
              onChange(title, 'risk_type', riskType);
            }}
          >
            <Text className="text-black text-sm tracking-wide text-center">{t('risknote.notRelevant')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center mx-1 py-2 border border-orange rounded-lg"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-black text-sm tracking-wide text-center">{t('risknote.toBeNoted')}</Text>
          </TouchableOpacity>
        </View>
          )}
      {modalVisible && (
        <RiskModal
          title={title}
          renderTitle={renderTitle}
          visible={modalVisible}
          initialDescription={description}
          onSubmit={handleModalSubmit}
          onClose={() => setModalVisible(false)}
          onReset={handleReset}
          isModification={isModification}
        />
      )}
    </View>
  );
};

export default RiskNote;