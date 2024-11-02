import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retrieveIdParams, getUserProfile } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';
import { signIn } from '@services/apiService';

const MicrosoftSignIn = () => {
  const [CLIENT_ID, setClientId] = useState('');
  const [TENANT_ID, setTenantId] = useState('');
  const { username, setUsername, setEmail } = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    retrieveIdParams({ setClientId, setTenantId });
  }, []);

  const discovery = {
    authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
    revocationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout`,
  };

  const redirectUri = makeRedirectUri({
    scheme: 'hazardhunt',
    path: 'redirect',
    useProxy: false,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
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
            // eslint-disable-next-line no-undef
            body: new URLSearchParams({
              client_id: CLIENT_ID,
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: redirectUri,
              code_verifier: request.codeVerifier,
              scope: 'https://graph.microsoft.com/.default'
            }).toString(),
          });

          const tokenData = await tokenResponse.json();

          if (tokenResponse.ok) {
            console.log('Token data retrieved successfully!');
            const accessToken = tokenData.access_token
            const userProfile = await getUserProfile({ setUsername, setEmail, accessToken });
            const name = userProfile[0]
            const id = userProfile[1]
            const data = await signIn(name, id);
            console.log(data)
            await AsyncStorage.setItem('access_token', data.access_token);
          } else {
            console.error('Error fetching token:', tokenData);
            Alert.alert('Token exchange failed', tokenData.error_description);
          }
        } catch (error) {
          console.error('Network error:', error);
          Alert.alert('Network error', 'Please try again later.');
        }
      };

      !username && exchangeCodeForToken();
    }
    if (response?.type === 'error') {
      console.log('Authentication Error:', response);
    }
  }, [response]);

  return (
    <View className="flex-1 justify-center items-center px-5">
      {username ? (
         <View className="py-2">
          <Text>{t('microsoftsignin.greeting')}, {username}!</Text>
        </View>
      ) : (
        <TouchableOpacity 
          onPress={() => promptAsync()} 
          className="bg-[#ef7d00] rounded-lg justify-center items-center py-4 px-6 w-3/4 my-2"
        >
          <Text className="text-white text-base font-bold">{t('microsoftsignin.signInText')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default MicrosoftSignIn;