import React, { createContext, useContext, useState } from 'react';
import useFormFields from '@hooks/useFormFields';

// Create a context for form data
const FormContext = createContext();

// Provider component
export const FormProvider = ({ children }) => {
  // Initialize form data using the useFormFields hook
  const { initialFormData } = useFormFields();

  const [formData, setFormData] = useState(initialFormData);
  const [task, setTask] = useState([]);
  const [scaffoldType, setScaffoldType] = useState([]);
  const [taskDesc, setTaskDesc] = useState('');

  const updateFormField = (title, field, value) => {
    console.log(`Updating ${title}.${field} to ${JSON.stringify(value, null, 2)}`);
    setFormData((prevData) => ({
      ...prevData,
      [title]: {
        ...prevData[title],
        [field]: value,
      },
    }));
  };

  const updateTranslations = (title, translations) => {
    if (typeof translations !== 'object' || translations === null || Array.isArray(translations)) {
      console.error('Translations must be a dictionary');
      return;
    }
    console.log(`Updating ${title}.translations to ${JSON.stringify(translations, null, 2)}`);
    setFormData((prevData) => ({
      ...prevData,
      [title]: {
        ...prevData[title],
        translations,
      },
    }));
  }

  const getFormData = (title, field) => {
    return formData[title]?.[field] || '';
  };

  const replaceFormData = (newFormData) => {
    setFormData(newFormData);
  };

  return (
    <FormContext.Provider  
      value={{ 
        formData, 
        updateFormField, 
        updateTranslations,
        getFormData,
        replaceFormData,
        task, 
        setTask, 
        scaffoldType, 
        setScaffoldType, 
        taskDesc, 
        setTaskDesc, 
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Hook to use form data context
export const useFormContext = () => useContext(FormContext);
