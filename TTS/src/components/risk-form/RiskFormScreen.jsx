import React from 'react';
import { FormProvider } from '@contexts/FormContext';
import RiskForm from '@components/risk-form/RiskForm';
import { TranslationProvider } from '@contexts/TranslationContext';

const RiskFormScreen = () => (
  <FormProvider>
    <TranslationProvider>
      <RiskForm/>
    </TranslationProvider>
  </FormProvider>
);

export default RiskFormScreen;
