import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'; 
import 'intl-pluralrules';

import { UserProvider } from './src/contexts/UserContext';
import Main from './src/components/Main'
import { ProjectSurveyProvider } from './src/contexts/ProjectSurveyContext';
import './src/lang/i18n';

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <UserProvider>
            <ProjectSurveyProvider>
              <Main />
            </ProjectSurveyProvider>
          </UserProvider>
        </NavigationContainer>
      </SafeAreaProvider>
      <StatusBar style='auto' />
    </>
  );
}
