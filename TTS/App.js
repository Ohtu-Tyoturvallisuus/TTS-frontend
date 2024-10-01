import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import { UserProvider } from './src/contexts/UserContext';
import Main from './src/components/Main'
import { WorksiteSurveyProvider } from './src/contexts/WorksiteSurveyContext';

export default function App() {
  return (
    <>
      <NativeRouter>
        <UserProvider>
          <WorksiteSurveyProvider>
            <Main />
          </WorksiteSurveyProvider>
        </UserProvider>
      </NativeRouter>
      <StatusBar style='auto' />
    </>
  );
}
