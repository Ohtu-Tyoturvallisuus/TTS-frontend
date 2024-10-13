import axios from "axios";
import constants from 'expo-constants';

const LOCAL_IP = constants.expoConfig.extra.local_ip;
const LOCAL_SETUP = constants.expoConfig.extra.local_setup === 'true';
console.log('Local setup:', LOCAL_SETUP, 'Local IP:', LOCAL_IP);
const API_BASE_URL = LOCAL_SETUP ? `http://${LOCAL_IP}:8000/api/` : `https://tts-app.azurewebsites.net/api/`;
console.log('API_BASE_URL:', API_BASE_URL);

export const signIn = async (username) => {
  const response = await axios.post(API_BASE_URL + 'signin/', { username });
  return response.data;
};

// Returns projects from the API
export const fetchProjectList = async () => {
  console.log('Making API request to:', API_BASE_URL + 'projects/');
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
  const url = API_BASE_URL + `projects/${projectId}/surveys/`;
  console.log('postNewSurvey:', url);
  const response = await axios.post(url, {
    description: desc,
    task: task,
    scaffold_type: scaffoldType,
  });
  return response.data;
};

export const postRiskNotes = async (surveyId, riskNotes) => {
  const url = API_BASE_URL + `surveys/${surveyId}/risk_notes/`;
  console.log('postRiskNotes:', url);
  const response = await axios.post(url, riskNotes);
  return response.data;
};

export const fetchSurveyData = async (url) => {
  console.log('fetchSurveyData:', url);
  const response = await axios.get(url);
  return response.data;
};