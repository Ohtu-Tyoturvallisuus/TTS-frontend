import axios from "axios";
import constants from 'expo-constants';

const LOCAL_IP = constants.expoConfig.extra.local_ip;
const LOCAL_SETUP = constants.expoConfig.extra.local_setup === 'true';
console.log('Local setup:', LOCAL_SETUP, 'Local IP:', LOCAL_IP);
const API_BASE_URL = LOCAL_SETUP ? `http://${LOCAL_IP}:8000/api/` : `https://tts-app.azurewebsites.net/api/`;
console.log('API_BASE_URL:', API_BASE_URL);

export const signIn = async (username) => {
  try {
    const response = await axios.post(API_BASE_URL + 'signin/', { username });
    return response.data;
  } catch (error) { throw error; }
};

// Returns projects from the API
export const fetchProjectList = async () => {
  try {
    console.log('Making API request to:', API_BASE_URL + 'projects/');
    const response = await axios.get(API_BASE_URL + 'projects/');
    const projects = response.data;
    return projects;
  } catch (error) { throw error; }
};

export const fetchProject = async (projectId) => {
  try {
    url = API_BASE_URL + `projects/${projectId}/`;
    console.log('fetchProject:', url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) { throw error; }
}

export const postNewSurvey = async (projectId, desc, task, scaffoldType) => {
  try {
    const url = API_BASE_URL + `projects/${projectId}/surveys/`;
    console.log('postNewSurvey:', url);
    const response = await axios.post(url, {
      description: desc,
      task: task,
      scaffold_type: scaffoldType,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postRiskNotes = async (surveyId, riskNotes) => {
  try {
    const url = API_BASE_URL + `surveys/${surveyId}/risk_notes/`;
    console.log('postRiskNotes:', url);
    const response = await axios.post(url, riskNotes);
    return response.data;
  } catch (error) {
    throw error;
  }
};