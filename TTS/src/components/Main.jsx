import React, { useEffect, useContext, useState } from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

import { UserContext } from '@contexts/UserContext';
import ProjectList from '@components/project-list/ProjectList';
import RiskForm from '@components/risk-form/RiskForm';
import CombinedSignIn from '@components/sign-in/CombinedSignIn';
import Settings from '@components/settings/Settings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = () => {
  const { username, setUsername } = useContext(UserContext)
  const { t } = useTranslation();
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error retrieving username', error);
      }
    };
  
    fetchUsername();
  }, [setUsername]);

  const MainStack = () => (
    <Stack.Navigator>
      {username ? (
        <> 
          <Stack.Screen name='ProjectList' component={ProjectList} options={{ headerShown: false }} />
          <Stack.Screen name="RiskForm" options={{ headerShown: false }}>
            {(props) => <RiskForm {...props} onFocusChange={setShowImage} />}
          </Stack.Screen>
        </>
        ) : (
          <Stack.Screen name='CombinedSignIn' component={CombinedSignIn} options={{ headerShown: false }} />
        )}
    </Stack.Navigator>
  )

  return (
    <View className="bg-white flex-1 justify-center">
      {showImage && <Image
        source={require('../../assets/telinekataja.png')}
        style={{ width: '100%', height: 150, resizeMode: 'contain' }} />
      }
        <View className="flex-1">
          <Tab.Navigator 
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Main') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#ef7d00",
              tabBarInactiveTintColor: "gray",
              tabBarStyle: [
                {
                  "display": "flex"
                },
                null
              ],
              headerShown: false,
            })}
          >
            <Tab.Screen name="Main" component={MainStack} options={{ title: t('main.navigationMain') }} />
            <Tab.Screen name="Settings" component={Settings} options={{ title: t('main.navigationSettings') }} />
          </Tab.Navigator>
        </View>
    </View>
  );
}

export default Main;