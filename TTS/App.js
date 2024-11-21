import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'; 
import 'intl-pluralrules';

import { UserProvider } from '@contexts/UserContext';
import Main from './src/components/Main'
import { ProjectSurveyProvider } from '@contexts/ProjectSurveyContext';
import './src/lang/i18n';
import { NavigationProvider } from '@contexts/NavigationContext';

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <NavigationProvider>
            <UserProvider>
              <ProjectSurveyProvider>
                <Main />
              </ProjectSurveyProvider>
            </UserProvider>
          </NavigationProvider>
        </NavigationContainer>
      </SafeAreaProvider>
      <StatusBar style='auto' />
    </>
  );
}
