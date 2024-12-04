import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const SettingsButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity className="bg-black rounded-lg justify-center items-center py-4 px-6 my-2 w-64" onPress={onPress}>
      <Text className="text-white font-bold">{text}</Text>
    </TouchableOpacity>
  );
};

export default SettingsButton;