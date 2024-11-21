import React, { useEffect, useContext } from 'react';
import { FormProvider } from '@contexts/FormContext';
import RiskForm from '@components/risk-form/RiskForm';
import { TranslationProvider } from '@contexts/TranslationContext';
import { NavigationContext } from '@contexts/NavigationContext';

const RiskFormScreen = () => {
  const { setCurrentLocation } = useContext(NavigationContext);

  useEffect(() => {
    setCurrentLocation('RiskForm')
  }, []);

  return (
    <FormProvider>
      <TranslationProvider>
        <RiskForm />
      </TranslationProvider>
    </FormProvider>
  )
};

export default RiskFormScreen;
