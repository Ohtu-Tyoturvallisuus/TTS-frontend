import React, { useEffect } from 'react';
import { FormProvider } from '@contexts/FormContext';
import RiskForm from '@components/risk-form/RiskForm';
import { TranslationProvider } from '@contexts/TranslationContext';
import { useIsFocused } from '@react-navigation/native';

const RiskFormScreen = ({ onFocusChange }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    onFocusChange(!isFocused);
  }, [isFocused, onFocusChange]);

  return (
    <FormProvider>
      <TranslationProvider>
        <RiskForm />
      </TranslationProvider>
    </FormProvider>
  )
};

export default RiskFormScreen;
