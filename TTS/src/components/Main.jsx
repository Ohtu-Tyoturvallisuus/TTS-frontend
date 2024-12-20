import React, { useEffect, useContext, useState } from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { UserContext } from '@contexts/UserContext';
import ProjectList from '@components/project-list/ProjectList';
import CombinedSignIn from '@components/sign-in/CombinedSignIn';
import Settings from '@components/settings/Settings';
import { NavigationContext } from '@contexts/NavigationContext';
import JoinSurvey from './risk-form/JoinSurvey';
import FormValidationView from '@components/risk-form/FormValidationView';
import RiskForm from '@components/risk-form/RiskForm';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = () => {
  const { currentLocation } = useContext(NavigationContext);
  const { username, setUsername, setAccessToken, isGuest, setIsGuest } = useContext(UserContext)
  const { t } = useTranslation();
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
        const storedAccessToken = await AsyncStorage.getItem('access_token');
        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
        }
        const guestStatus = await AsyncStorage.getItem('is_guest');
        if (guestStatus === 'true') {
          setIsGuest(true);
        }
      } catch (error) {
        console.error('Error retrieving user information', error);
      }
    };

    fetchUserInfo();
  }, [setUsername, setIsGuest]);

  useEffect(() => {
    console.log('Location set to:', currentLocation)
    currentLocation === 'RiskForm'
      ? setShowImage(false)
      : setShowImage(true)
  }, [currentLocation])

  const MainStack = () => (
    <Stack.Navigator>
      {username ? (
        <>
          <Stack.Screen
            name='ProjectList'
            component={ProjectList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RiskForm"
            component={RiskForm}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FormValidationView"
            component={FormValidationView}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name='CombinedSignIn'
          component={CombinedSignIn}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );

  return (
    <View className="bg-white flex-1 justify-center pt-6">
      {showImage && <Image
        source={require('../../assets/telinekataja.png')}
        style={{ width: '100%', height: 100, resizeMode: 'contain' }}
      />
      }
        <View className="flex-1">
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Main') {
                  iconName = focused ? 'home' : 'home-outline';
                }
                if (route.name === 'JoinSurvey') {
                  iconName = focused ? 'clipboard' : 'clipboard-outline';
                }
                if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#ef7d00",
              tabBarInactiveTintColor: "gray",
              tabBarStyle: [
                {
                  "display": currentLocation === 'RiskForm' ? 'none' : 'flex'
                },
                null
              ],
              headerShown: false,
            })}
          >
            {!isGuest && (
              <Tab.Screen
                name="Main"
                component={MainStack}
                options={{ title: t('main.navigationMain') }}
              />
            )}
            {username && (
              <Tab.Screen
                name="JoinSurvey"
                component={JoinSurvey}
                options={{ title: t('main.navigationJoinSurvey') }}
              />
            )}
            <Tab.Screen
              name="Settings"
              component={Settings}
              options={{ title: t('main.navigationSettings') }}
            />
          </Tab.Navigator>
        </View>
    </View>
  );
};

export default Main;
