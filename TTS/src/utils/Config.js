import * as Updates from 'expo-updates';

const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP;
const LOCAL_SETUP = process.env.EXPO_PUBLIC_LOCAL_SETUP === 'true';
const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'main';
console.log('Local setup:', LOCAL_SETUP, 'Local IP:', LOCAL_IP, 'Environment:', ENVIRONMENT);

let apiBaseUrl = '';
if (LOCAL_SETUP) {
  apiBaseUrl = `http://${LOCAL_IP}:8000/api/`;
} else {
  switch (ENVIRONMENT) {
    case 'uat':
      apiBaseUrl = 'https://tts-app-uat.azurewebsites.net/api/';
      break;
    case 'production':
      apiBaseUrl = 'https://tts-app-prod.azurewebsites.net/api/';
      break;
    default:
      apiBaseUrl = 'https://tts-app.azurewebsites.net/api/';
      break;
  }
}
console.log('API_BASE_URL:', apiBaseUrl);

let Config = {
  apiUrl: apiBaseUrl
};

if (Updates.channel === 'production') {
  Config.apiUrl = 'https://tts-app-prod.azurewebsites.net/api/';
} else if (Updates.channel === 'uat') {
  Config.apiUrl = 'https://tts-app-uat.azurewebsites.net/api/';
}

export default Config;
