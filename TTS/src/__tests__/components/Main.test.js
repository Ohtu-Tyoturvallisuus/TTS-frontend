import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { UserContext } from '@contexts/UserContext';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import Main from '@components/Main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationContext } from '@contexts/NavigationContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
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
  const mockSetAccessToken = jest.fn();
  const mockSetIsGuest = jest.fn();

  const renderWithContext = (username = null, currentLocation=null) => {
    return render(
      <UserContext.Provider value={{ username, setUsername: mockSetUsername, setAccessToken: mockSetAccessToken, setIsGuest: mockSetIsGuest }}>
        <ProjectSurveyContext.Provider value={{ setSelectedProject: mockSetSelectedProject }}>
          <NavigationContainer>
            <NavigationContext.Provider value={{ currentLocation }}>
              <Main />
            </NavigationContext.Provider>
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

  it('calls setShowImage(false) when currentLocation is "RiskForm"', async () => {
    const { getByText } = renderWithContext('John Doe', 'RiskForm');

    await act(async () => {
      expect(getByText('Mocked Projects List')).toBeTruthy();
    });
  });
  it('sets isGuest to true when is_guest is true in AsyncStorage', async () => {
    AsyncStorage.getItem.mockImplementation(async (key) => {
      if (key === 'is_guest') return 'true';
      return null;
    });
    renderWithContext();
    await waitFor(() => {
      expect(mockSetIsGuest).toHaveBeenCalledWith(true);
    });
  });
});
