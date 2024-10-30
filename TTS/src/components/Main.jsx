import React, { useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { UserContext } from '@contexts/UserContext';
import ProjectList from '@components/project-list/ProjectList';
import RiskForm from '@components/risk-form/RiskForm';
import MicrosoftSignIn from '@components/sign-in/MicrosoftSignIn';
import Settings from '@components/settings/Settings';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = () => {
  const { username, setUsername } = useContext(UserContext)

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
          <Stack.Screen name='RiskForm' component={RiskForm} options={{ headerShown: false }} />
        </>
        ) : (
          <Stack.Screen name='MicrosoftSignIn' component={MicrosoftSignIn} options={{ headerShown: false }} />
        )}
    </Stack.Navigator>
  )

  return (
    <View style={styles.container}>
        <View style={styles.content}>
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
              tabBarActiveTintColor: "blue",
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
            <Tab.Screen name="Main" component={MainStack} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});

export default Main;