import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from 'expo-constants'

const MicrosoftSignIn = () => {
  const LOCAL_IP = constants.expoConfig.extra.local_ip;
  const LOCAL_SETUP = constants.expoConfig.extra.local_setup === 'true';
  const RETRIEVE_PARAMS_URL = LOCAL_SETUP 
    ? `http://${LOCAL_IP}:8000/api/retrieve-params`
    : `https://tts-app.azurewebsites.net/api/retrieve-params`
  const [CLIENT_ID, setClientId] = useState('');
  const [TENANT_ID, setTenantId] = useState('');
  const { username, setUsername } = useContext(UserContext);

  useEffect(() => {
    const retrieveIdParams = async () => {
      try {
        const response = await fetch(RETRIEVE_PARAMS_URL, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        setClientId(data.client_id)
        setTenantId(data.tenant_id)
      } catch (error) {
        console.error('Error retrieving params:', error);
      }
    };
    retrieveIdParams();
  }, []);

  const discovery = {
    authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    revocationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout`,
  };

  const redirectUri = makeRedirectUri({
    scheme: 'HazardHunt',
    useProxy: false,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authentication Success!');
      
      const exchangeCodeForToken = async () => {
        try {
          const tokenResponse = await fetch(discovery.tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: CLIENT_ID,
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: redirectUri,
              code_verifier: request.codeVerifier,
            }).toString(),
          });

          const tokenData = await tokenResponse.json();

          if (tokenResponse.ok) {
            console.log('Token data:', tokenData);
            getUserProfile(tokenData.access_token);
          } else {
            console.error('Error fetching token:', tokenData);
            Alert.alert('Token exchange failed', tokenData.error_description);
          }
        } catch (error) {
          console.error('Network error:', error);
          Alert.alert('Network error', 'Please try again later.');
        }
      };

      exchangeCodeForToken();
    } else if (response?.type === 'error') {
      console.log('Authentication Error:', response);
    }
  }, [response]);

  const getUserProfile = async (accessToken) => {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const profileData = await response.json();
      
      if (response.ok) {
        console.log('User Profile:', profileData);
        await AsyncStorage.setItem('username', profileData.displayName);
        setUsername(profileData.displayName);
      } else {
        console.error('Error fetching profile:', profileData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <View style={{ paddingHorizontal: 20 }}>
      {username ? (
        <View style={{paddingVertical: 10}}>
          <Text>Hello, {username}!</Text>
        </View>
      ) : (
        <TouchableOpacity 
          onPress={() => promptAsync()} 
          style={{ marginTop: 20, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Login with Microsoft</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default MicrosoftSignIn;