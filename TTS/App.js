import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import { UserProvider } from './src/contexts/UserContext';
import Main from './src/components/Main'
import { ProjectSurveyProvider } from './src/contexts/ProjectSurveyContext';

export default function App() {
  return (
    <>
      <NativeRouter>
        <UserProvider>
          <ProjectSurveyProvider>
            <Main />
          </ProjectSurveyProvider>
        </UserProvider>
      </NativeRouter>
      <StatusBar style='auto' />
    </>
  );
}
