import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { UserContext } from '@contexts/UserContext';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import Main from '@components/Main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationProvider } from '@contexts/NavigationContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');

  const GestureHandlerRootView = ({ children }) => <View>{children}</View>;
  const PanGestureHandler = ({ children }) => <View>{children}</View>;
  const TouchableOpacity = ({ children, onPress }) => (
    <View onTouchEnd={onPress}>{children}</View>
  );

  return {
    GestureHandlerRootView,
    PanGestureHandler,
    TouchableOpacity,
  };
});

jest.mock('expo-linking', () => ({
  createURL: jest.fn((path) => `mock://localhost/${path}`),
}));

jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: () => null,
  };
});

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('@components/project-list/ProjectList', () => {
  const { Text } = require('react-native');
  const MockedProjectList = () => <Text>Mocked Projects List</Text>;
  MockedProjectList.displayName = 'MockedProjectList';
  return MockedProjectList;
});

jest.mock('@services/apiService', () => ({
  retrieveIdParams: jest.fn(),
  getUserProfile: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'microsoftsignin.signInText': 'Microsoft sign-in',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Main Component', () => {
  const mockSetUsername = jest.fn();
  const mockSetSelectedProject = jest.fn();

  const renderWithContext = (username = null) => {
    return render(
      <UserContext.Provider value={{ username, setUsername: mockSetUsername }}>
        <ProjectSurveyContext.Provider value={{ setSelectedProject: mockSetSelectedProject }}>
          <NavigationContainer>
            <NavigationProvider>
              <Main />
            </NavigationProvider>
          </NavigationContainer>
        </ProjectSurveyContext.Provider>
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches username from AsyncStorage and sets it', async () => {
    AsyncStorage.getItem.mockResolvedValue('John Doe');

    renderWithContext();

    await waitFor(() => {
      expect(mockSetUsername).toHaveBeenCalledWith('John Doe');
    });
  });

  it('renders ProjectList when username exists', async () => {
    AsyncStorage.getItem.mockResolvedValue('John Doe');

    const { getByText } = renderWithContext('John Doe');

    await waitFor(() => {
      expect(getByText('Mocked Projects List')).toBeTruthy();
    });
  });

  it('renders MicrosoftSignIn when no username exists', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByText } = renderWithContext();

    await waitFor(() => {
      expect(getByText('Microsoft sign-in')).toBeTruthy();
    });
  });

  it('handles error when fetching username', async () => {
    AsyncStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Error fetching username');
    });

    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithContext();

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error retrieving user information', expect.any(Error));
    });

    consoleError.mockRestore();
  });
});
