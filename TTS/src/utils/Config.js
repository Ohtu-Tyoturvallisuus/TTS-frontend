import * as Updates from 'expo-updates';

const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP;
const LOCAL_SETUP = process.env.EXPO_PUBLIC_LOCAL_SETUP === 'true';
const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'main';
console.log('Local setup:', LOCAL_SETUP, 'Local IP:', LOCAL_IP, 'Environment:', ENVIRONMENT);

let API_BASE_URL = '';
if (LOCAL_SETUP) {
  API_BASE_URL = `http://${LOCAL_IP}:8000/api/`;
} else {
  switch (ENVIRONMENT) {
    case 'uat':
      API_BASE_URL = 'https://tts-app-uat.azurewebsites.net/api/';
      break;
    case 'production':
      API_BASE_URL = 'https://tts-app-prod.azurewebsites.net/api/';
      break;
    default:
      API_BASE_URL = 'https://tts-app.azurewebsites.net/api/';
      break;
  }
}
console.log('API_BASE_URL:', API_BASE_URL);

let Config = {
  apiUrl: API_BASE_URL
};

if (Updates.channel === 'production') {
  Config.apiUrl = 'https://tts-app-prod.azurewebsites.net/api/';
} else if (Updates.channel === 'uat') {
  Config.apiUrl = 'https://tts-app-uat.azurewebsites.net/api/';
}

export default Config;
