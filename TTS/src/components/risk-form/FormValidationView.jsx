import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFormContext } from '@contexts/FormContext';
import { useTranslationLanguages } from '@contexts/TranslationContext';

const FormValidationView = () => {
  // TODO: hook for validated users using survey_id
  const {
    formData,
    updateFormField,
    replaceFormData,
    task,
    setTask,
    scaffoldType,
    setScaffoldType,
    taskDesc,
    setTaskDesc,
  } = useFormContext();

  const { fromLang, toLangs } = useTranslationLanguages();

  return (
    <View className="flex-1 bg-white p-5">
      <ScrollView>
        <Text className="text-lg">{fromLang}{toLangs}</Text>
        <Text className="text-lg">Form Data: {JSON.stringify(formData)}</Text>
        <Text className="text-lg">Task: {JSON.stringify(task)}</Text>
        <Text className="text-lg">Scaffold Type: {JSON.stringify(scaffoldType)}</Text>
        <Text className="text-lg">Task Description: {JSON.stringify(taskDesc)}</Text>
      </ScrollView>
    </View>
  );
}

export default FormValidationView;
