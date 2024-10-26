import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import enFormFields from '@lang/locales/en/formFields.json';
import fiFormFields from '@lang/locales/fi/formFields.json';

// Helper function to get form fields by language
const getFormFieldsByLanguage = (language) => {
  switch (language) {
    case 'fi':
      return fiFormFields;
    case 'en':
    default:
      return enFormFields; // Fallback to English if no match
  }
};

// Helper function to create initial form data
const createInitialFormData = (formFields, t) => {
  const initialData = {};
  Object.keys(formFields).forEach((key) => {
    initialData[key] = {
      description: '',
      status: '',
      risk_type: t(`${key}.risk_type`, { ns: 'formFields' }),
    };
  });
  return initialData;
};

// Hook that returns form structure in selected language
const useFormFields = () => {
  const { t, i18n } = useTranslation(['translation', 'formFields']);
  const [formFields, setFormFields] = useState(getFormFieldsByLanguage(i18n.language));
  const [initialFormData, setInitialFormData] = useState(createInitialFormData(formFields, t));

  useEffect(() => {
    const updatedFormFields = getFormFieldsByLanguage(i18n.language);
    setFormFields(updatedFormFields);
    setInitialFormData(createInitialFormData(updatedFormFields, t));
  }, [i18n.language, t]);

  return { initialFormData };
};

export default useFormFields;