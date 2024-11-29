// TaskInfo.jsx
import React, { useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { useFormContext } from '@contexts/FormContext';
import MaterialCommunityIcons  from '@expo/vector-icons/MaterialCommunityIcons';
import MultiChoiceButtonGroup from '@components/buttons/MultiChoiceButtonGroup';
import SpeechToTextView from '@components/speech-to-text/SpeechToTextView';
import SelectTranslateLanguage from '@components/speech-to-text/SelectTranslateLanguage';
import { useScaffoldItems } from '@utils/scaffoldUtils';
import { useTranslationLanguages } from '@contexts/TranslationContext';
import { performTranslations } from '@services/performTranslations';
import TranslationsView from '@components/speech-to-text/TranslationsView';

const TaskInfo = ({ project, setToLangs }) => {
  const {
    getFormData,
    task,
    setTask,
    scaffoldType,
    setScaffoldType,
    taskDesc,
    setTaskDesc,
    updateTranslations,
  } = useFormContext();
  const title = 'taskInfo';
  const { t } = useTranslation();
  const [newTranslations, setNewTranslations] = useState({});
  const translations = getFormData(title, 'translations');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fromLang, toLangs } = useTranslationLanguages();

  const scaffoldItems = useScaffoldItems();

  const translateDescription = async () => {
    setLoading(true);
    try {
      const { translations: result, error } = await performTranslations(taskDesc, fromLang, toLangs);
      console.log('TRANSLATIONS MADE: ', result);
      setNewTranslations(result);
      updateTranslations(title, result);
      setError(error);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslatePress = () => {
    updateTranslations('taskDesc', {});
    translateDescription();
  };

  return (
    <View className="mb-3">
      <SelectTranslateLanguage setTranslationLanguages={setToLangs} />

      <Text className="text-lg font-bold py-2">{t('riskform.projectName')}:</Text>
      <Text>{project.project_name}</Text>

      <Text className="text-lg font-bold py-2">{t('riskform.projectId')}: </Text>
      <Text>{project.project_id}</Text>

      <Text className="text-lg font-bold py-2">{t('riskform.task')}:</Text>
      <MultiChoiceButtonGroup
        options={['installation', 'modification', 'dismantling']}
        selectedValues={task}
        onChange={(value) => setTask(value)}
        renderOption={(option) => t(`riskform.${option}`)}
      />

      <Text className="text-lg font-bold py-2">{t('riskform.scaffoldType')}:</Text>
      <View>
        <SectionedMultiSelect
          items={scaffoldItems}
          IconRenderer={Icon}
          uniqueKey="id"
          onSelectedItemsChange={setScaffoldType}
          selectedItems={scaffoldType}
          selectText={t('riskform.chooseScaffoldType')}
          selectedText={t('riskform.selected')}
          confirmText={t('general.confirm')}
          hideSearch
          colors={{ success: '#ef7d00' }}
          styles={{
            button: {
              backgroundColor: '#ef7d00',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              paddingVertical: 12,
              paddingHorizontal: 24,
              width: '90%',
              marginVertical: 20,
            },
            container: {
              marginVertical: 60,
            },
            item: {
              margin: 10,
              padding: 10,
            },
            selectedItemText: {
              color: '#ef7d00',
            },
            selectToggle: {
              borderRadius: 12,
              borderColor: 'black',
              borderWidth: 1,
              padding: 12,
            },
            chipContainer: {
              borderRadius: 12,
            },
          }}
        />
      </View>

      <Text className="text-lg font-bold py-2">{t('riskform.taskDescription')}:</Text>
      <TextInput
        testID='taskDesc'
        className="border border-gray-300 rounded p-2 h-24"
        value={taskDesc}
        onChangeText={(value) => setTaskDesc(value)}
        multiline={true}
        textAlignVertical="top"
      />
      <View className="flex-row justify-between mx-8">
        <SpeechToTextView
          setDescription={setTaskDesc}
          translate={false}
        />
        <TouchableOpacity
          testID='translate-button'
          style={[
            styles.button,
            taskDesc !== '' && toLangs.length > 0
              ? styles.translateButton
              : styles.disabledButton
          ]}
          onPress={handleTranslatePress}
          disabled={taskDesc === '' || toLangs.length === 0}
        >
          <Text style={styles.buttonText}>{t('taskinfo.translate')}</Text>
          <MaterialCommunityIcons name="translate" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#ef7d00" />
      ) : (
        newTranslations && Object.keys(newTranslations).length > 0 ? (
          <TranslationsView translations={newTranslations} hide={true} />
        ) : (
          <TranslationsView translations={translations} hide={true} />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
  translateButton: {
    backgroundColor: 'green',
  },
});

export default TaskInfo;
