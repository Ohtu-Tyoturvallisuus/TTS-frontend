import React from 'react';
import { FormProvider } from '@contexts/FormContext';
import RiskForm from '@components/risk-form/RiskForm';

const RiskFormScreen = () => (
  <FormProvider>
    <RiskForm />
  </FormProvider>
);

export default RiskFormScreen;