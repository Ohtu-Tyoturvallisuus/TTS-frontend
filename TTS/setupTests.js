import '@testing-library/jest-native/extend-expect';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

process.env = Object.assign(process.env, {
  EXPO_PUBLIC_LOCAL_SETUP: 'false',
  EXPO_PUBLIC_ENVIRONMENT: 'main',
  EXPO_PUBLIC_LOCAL_IP: '192.168.1.1'
});