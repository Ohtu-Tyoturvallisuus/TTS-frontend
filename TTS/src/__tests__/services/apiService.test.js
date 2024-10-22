import axios from 'axios';
import {
  signIn,
  fetchProjectList,
  fetchProject,
  postNewSurvey,
  postRiskNotes,
  fetchSurveyData,
} from '@services/apiService';

jest.mock('expo-constants', () => ({
    expoConfig: {
      extra: {
        local_ip: '192.168.1.1',
        local_setup: 'true',
      },
    },
  }));

jest.mock('axios');

describe('API Module', () => {
  const mockResponse = { data: 'mock data' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('signIn calls the correct API and returns data', async () => {
    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await signIn('testUser');

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/signin/'), { username: 'testUser' });
    expect(response).toEqual('mock data');
  });

  test('fetchProjectList calls the correct API and returns data', async () => {
    axios.get.mockResolvedValueOnce(mockResponse);

    const response = await fetchProjectList();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/projects/'));
    expect(response).toEqual('mock data');
  });

  test('fetchProject calls the correct API and returns data', async () => {
    const projectId = 1;
    axios.get.mockResolvedValueOnce(mockResponse);

    const response = await fetchProject(projectId);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/projects/${projectId}/`));
    expect(response).toEqual('mock data');
  });

  test('postNewSurvey calls the correct API and returns data', async () => {
    const projectId = 1;
    const desc = 'Survey description';
    const task = 'Task';
    const scaffoldType = 'Type';
    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await postNewSurvey(projectId, desc, task, scaffoldType);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(`/projects/${projectId}/surveys/`), {
      description: desc,
      task: task,
      scaffold_type: scaffoldType,
    });
    expect(response).toEqual('mock data');
  });

  test('postRiskNotes calls the correct API and returns data', async () => {
    const surveyId = 1;
    const riskNotes = [{ note: 'Risk 1' }];
    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await postRiskNotes(surveyId, riskNotes);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(`/surveys/${surveyId}/risk_notes/`), riskNotes);
    expect(response).toEqual('mock data');
  });

  test('fetchSurveyData calls the correct API and returns data', async () => {
    const url = 'http://example.com/survey';
    axios.get.mockResolvedValueOnce(mockResponse);

    const response = await fetchSurveyData(url);

    expect(axios.get).toHaveBeenCalledWith(url);
    expect(response).toEqual('mock data');
  });
});
