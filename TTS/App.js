import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';
import 'intl-pluralrules';

import { UserProvider } from './src/contexts/UserContext';
import Main from './src/components/Main'
import { ProjectSurveyProvider } from './src/contexts/ProjectSurveyContext';
import './src/lang/i18n';
import { FormProvider } from './src/contexts/FormContext';

export default function App() {
  return (
    <>
      <NativeRouter>
        <UserProvider>
          <ProjectSurveyProvider>
            <FormProvider>
              <Main />
            </FormProvider>
          </ProjectSurveyProvider>
        </UserProvider>
      </NativeRouter>
      <StatusBar style='auto' />
    </>
  );
}
