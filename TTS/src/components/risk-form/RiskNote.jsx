import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RiskModal from './RiskModal';

const RiskNote = ({ title, initialStatus, initialDescription, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isModification, setIsModification] = useState(false);

  const handleModalSubmit = (newDescription) => {
    setModalVisible(false);
    setStatus('Kunnossa');
    onChange(title, 'description', newDescription);
    onChange(title, 'status', 'Kunnossa');
  };

  const handleEditPress = () => {
    setIsModification(true);
    setModalVisible(true);
  };

  const handleReset = () => {
    console.log('Resetoidaan riski:', title);
    setIsModification(false);
    setStatus('');
    onChange(title, 'description', '');
    onChange(title, 'status', '');
    setModalVisible(false);
  };

  return (
    <View>
      <Text className="self-center text-base font-bold my-2">{title}</Text>
      {status === 'Kunnossa' ? (
        <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1 items-center justify-center">
          <Text className="self-center text-[#008000] text-base font-bold my-2">Kunnossa</Text>
          </View>
          <TouchableOpacity
            className="absolute right-0 w-10 h-10 items-center justify-center border border-light-grey rounded-lg"
            onPress={handleEditPress}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        </View>
      ) : status === 'Ei koske' ? (
        <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1 items-center justify-center">
          <Text className="self-center text-light-grey text-base font-bold my-2">Ei koske</Text>
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
          setStatus('Ei koske');
          onChange(title, 'status', 'Ei koske');
        }}
      >
        <Text className="text-black text-sm tracking-wide text-center">Ei koske</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 items-center justify-center mx-1 py-2 border border-orange rounded-lg"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-black text-sm tracking-wide text-center">Huomioitavaa</Text>
      </TouchableOpacity>
    </View>
      )}
      {modalVisible && (
        <RiskModal
          title={title}
          visible={modalVisible}
          initialDescription={initialDescription}
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