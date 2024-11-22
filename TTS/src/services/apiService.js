import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@utils/Config";

const API_BASE_URL = Config.apiUrl;
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

export const uploadAudio = async (fileUri, recordingLanguage, translationLanguages) => {
  const token = await AsyncStorage.getItem('access_token');
  let formData = new FormData();
  const fileType = "audio/3gp";

  formData.append('audio', {
    uri: fileUri,
    name: 'audio.3gp',
    type: fileType
  });

  formData.append('recordingLanguage', recordingLanguage);
  formData.append('translationLanguages', JSON.stringify(translationLanguages));

  const url = API_BASE_URL + 'transcribe/';
  console.log('uploadAudio:', url);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (result.error) {
      if (result.error === "Invalid or expired token") {
        console.error("Invalid or expired token. Please log in again.");
      } else {
        console.error("Error from server:", result.error);
      }
      return null;
    }

    console.log("File uploaded successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to upload file:", error);
    return null;
  }
};

export const postImages = async (imageData) => {
  const token = await AsyncStorage.getItem('access_token');
  const url = API_BASE_URL + 'upload-images/';
  console.log('apiService/postImages:', url);
  const response = await axios.post(url, imageData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
// Add this function to apiService.js

export const translateText = async (text, from='fi', to=['en']) => {
  const token = await AsyncStorage.getItem('access_token');
  const url = API_BASE_URL + 'translate/';
  console.log('translateText:', url);

  try {
    const response = await axios.post(url,         
    {
      text: text,
      from: from,
      to: to,
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
    );

    return response.data;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

export const retrieveImage = async (image) => {
  const url = `${API_BASE_URL}retrieve-image/?blob_name=images/${image}`;
  try {
    const response = await axios.get(url, {
      responseType: 'blob',
    });
    const blob = response.data;
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    return null;
  }
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

export const getUserSurveys = async (accessToken) => {
  const url = API_BASE_URL + 'filled-surveys/'
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
  });
  return response.data;
};

export const getSurveyByAccessCode = async (access_code) => {
  const url = API_BASE_URL + 'surveys/code/' + access_code;
  console.log('Getting survey by access code:', access_code);
  const response = await axios.get(url);
  console.log('RESPONSE:', response.data)
  return response.data;
}