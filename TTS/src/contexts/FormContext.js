// FormContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import useFormFields from '@hooks/useFormFields';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import useMergedSurveyData from '@hooks/useMergedSurveyData';

// Create a context for form data
const FormContext = createContext();

// Provider component
export const FormProvider = ({ children }) => {
  // Initialize form data using the useFormFields hook
  const { initialFormData } = useFormFields();
  const [formData, setFormData] = useState(initialFormData);
  const [task, setTask] = useState('');
  const [scaffoldType, setScaffoldType] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  const { selectedSurveyURL } = useContext(ProjectSurveyContext);

  // Fetch merged survey data when prevSurveyURL is available
  const { mergedFormData, taskDetails, error, isMerged } = useMergedSurveyData(selectedSurveyURL, initialFormData);

  // Merge previous survey data if available
  useEffect(() => {
    if (isMerged) {
      setFormData(mergedFormData);
      const { task, scaffoldType, taskDesc } = taskDetails;
      setTask(task);
      setScaffoldType(scaffoldType);
      setTaskDesc(taskDesc);
    }
  }, [isMerged]);

  // Function to update specific field of a risk
  const updateFormData = (category, field, value) => {
    console.log(`Updating ${category}.${field} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [field]: value,
      },
    }));
  };

  // Function to get specific field data
  const getFormData = (category, field) => {
    return formData[category]?.[field] || '';
  };

  return (
    <FormContext.Provider  
      value={{ 
        formData, 
        updateFormData, 
        getFormData,
        task, 
        setTask, 
        scaffoldType, 
        setScaffoldType, 
        taskDesc, 
        setTaskDesc, 
        error 
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Hook to use form data context
export const useFormContext = () => useContext(FormContext);
