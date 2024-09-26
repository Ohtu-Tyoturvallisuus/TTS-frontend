import { StatusBar } from 'expo-status-bar';
import { NativeRouter } from 'react-router-native';

import { UserProvider } from './src/contexts/UserContext';
import Main from './src/components/Main'

export default function App() {
  return (
    <>
      <NativeRouter>
        <UserProvider>
          <Main />
        </UserProvider>
      </NativeRouter>
      <StatusBar style='auto' />
    </>
  );
}
