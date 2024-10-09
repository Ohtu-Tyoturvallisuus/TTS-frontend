import axios from "axios";
import constants from 'expo-constants';

const LOCAL_IP = constants.expoConfig.extra.local_ip;
const LOCAL_SETUP = constants.expoConfig.extra.local_setup === 'true';
console.log('Local setup:', LOCAL_SETUP, 'Local IP:', LOCAL_IP);
const API_BASE_URL = LOCAL_SETUP ? `http://${LOCAL_IP}:8000/api/` : `https://tts-app.azurewebsites.net/api/`;
console.log('API_BASE_URL:', API_BASE_URL);

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
