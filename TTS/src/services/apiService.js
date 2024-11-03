import axios from "axios";
import constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL_IP = constants.expoConfig.extra.local_ip;
const LOCAL_SETUP = constants.expoConfig.extra.local_setup === 'true';
console.log('Local setup:', LOCAL_SETUP, 'Local IP:', LOCAL_IP);
const API_BASE_URL = LOCAL_SETUP ? `http://${LOCAL_IP}:8000/api/` : `https://tts-app.azurewebsites.net/api/`;
console.log('API_BASE_URL:', API_BASE_URL);
const RETRIEVE_PARAMS_URL = API_BASE_URL + 'retrieve-params/'

export const signIn = async (username, id = null, guest = null) => {
  const response = await axios.post(API_BASE_URL + 'signin/', { username, id, guest });
  return response.data;
};

// Returns projects from the API
export const fetchProjectList = async () => {
  const response = await axios.get(API_BASE_URL + 'projects/');
  return response.data;
};

export const fetchProject = async (projectId) => {
  const url = API_BASE_URL + `projects/${projectId}/`;
  console.log('fetchProject:', url);
  const response = await axios.get(url);
  return response.data;
};

export const postNewSurvey = async (projectId, desc, task, scaffoldType) => {
  const token = await AsyncStorage.getItem('access_token');
  const url = API_BASE_URL + `projects/${projectId}/surveys/`;
  console.log('postNewSurvey:', url);
  const response = await axios.post(url, {
    description: desc,
    task: task,
    scaffold_type: scaffoldType,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const postRiskNotes = async (surveyId, riskNotes) => {
  const token = await AsyncStorage.getItem('access_token');
  const url = API_BASE_URL + `surveys/${surveyId}/risk_notes/`;
  console.log('postRiskNotes:', url);
  const response = await axios.post(
    url,
    riskNotes,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchSurveyData = async (url) => {
  console.log('fetchSurveyData:', url);
  const response = await axios.get(url);
  return response.data;
};

export const postImages = async (imageData) => {
  const url = API_BASE_URL + 'upload-images/';
  console.log('apiService/postImages:', url);
  const response = await axios.post(url, imageData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const retrieveIdParams = async ({ setClientId, setTenantId }) => {
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

export const getUserProfile = async ({ setUsername, setEmail, accessToken }) => {
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
      await AsyncStorage.setItem('email', profileData.mail);
      setEmail(profileData.mail);

      return [profileData.displayName, profileData.id];
    } else {
      console.error('Error fetching profile:', profileData);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
