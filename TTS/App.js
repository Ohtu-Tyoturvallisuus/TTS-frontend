import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import 'intl-pluralrules';

import { UserProvider } from '@contexts/UserContext';
import Main from './src/components/Main'
import { ProjectSurveyProvider } from '@contexts/ProjectSurveyContext';
import './src/lang/i18n';
import { NavigationProvider } from '@contexts/NavigationContext';
import { FormProvider } from '@contexts/FormContext';
import { TranslationProvider } from '@contexts/TranslationContext';

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <NavigationProvider>
            <UserProvider>
              <ProjectSurveyProvider>
                <FormProvider>
                  <TranslationProvider>
                    <Main />
                  </TranslationProvider>
                </FormProvider>
              </ProjectSurveyProvider>
            </UserProvider>
          </NavigationProvider>
        </NavigationContainer>
      </SafeAreaProvider>
      <StatusBar style='auto' />
    </>
  );
}
