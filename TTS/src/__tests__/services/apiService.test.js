import axios from 'axios';
import {
  signIn,
  fetchProjectList,
  fetchProject,
  postNewSurvey,
  postRiskNotes,
  postImages,
  fetchSurveyData,
  retrieveIdParams,
  getUserProfile,
  uploadAudio,
} from '@services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('API Module - retrieveIdParams and getUserProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('retrieveIdParams', () => {
    it('should fetch client_id and tenant_id and call setClientId and setTenantId', async () => {
      const mockResponse = {
        client_id: 'test-client-id',
        tenant_id: 'test-tenant-id',
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const setClientId = jest.fn();
      const setTenantId = jest.fn();

      await retrieveIdParams({ setClientId, setTenantId });

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('retrieve-params/'), {
        method: 'GET',
      });
      expect(setClientId).toHaveBeenCalledWith('test-client-id');
      expect(setTenantId).toHaveBeenCalledWith('test-tenant-id');
    });

    it('should handle errors if fetch fails', async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      const setClientId = jest.fn();
      const setTenantId = jest.fn();

      await retrieveIdParams({ setClientId, setTenantId });

      expect(setClientId).not.toHaveBeenCalled();
      expect(setTenantId).not.toHaveBeenCalled();
    });
  });

  describe('getUserProfile', () => {
    it('should fetch user profile, call setUsername, call setEmail and store displayName in AsyncStorage', async () => {
      const mockProfileData = {
        displayName: 'Test User',
        mail: 'test@mail.com'

      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockProfileData),
      });

      const setUsername = jest.fn();
      const setEmail = jest.fn();
      const accessToken = 'test-access-token';

      await getUserProfile({ setUsername, setEmail, accessToken });

      expect(fetch).toHaveBeenCalledWith('https://graph.microsoft.com/v1.0/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(setUsername).toHaveBeenCalledWith('Test User');
      expect(setEmail).toHaveBeenCalledWith('test@mail.com');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'Test User');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('email', 'test@mail.com');
    });

    it('should handle errors if fetch fails', async () => {
      fetch.mockResolvedValueOnce({ ok: false, json: jest.fn().mockResolvedValueOnce({ error: 'Error' }) });

      const setUsername = jest.fn();
      const accessToken = 'test-access-token';

      await getUserProfile({ setUsername, accessToken });

      expect(setUsername).not.toHaveBeenCalled();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle network errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const setUsername = jest.fn();
      const accessToken = 'test-access-token';

      await getUserProfile({ setUsername, accessToken });

      expect(setUsername).not.toHaveBeenCalled();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });
});

describe('API Module', () => {
  const mockResponse = { data: 'mock data' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('signIn calls the correct API and returns data', async () => {
    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await signIn('testUser');

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/signin/'), { username: 'testUser', id: null, guest: null });
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
    },
    {
      headers: {
        Authorization: `Bearer undefined`,
      },
    });
    expect(response).toEqual('mock data');
  });

  test('postRiskNotes calls the correct API and returns data', async () => {
    const surveyId = 1;
    const riskNotes = [{ note: 'Risk 1' }];
    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await postRiskNotes(surveyId, riskNotes);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(`/surveys/${surveyId}/risk_notes/`), riskNotes, {
      headers: {
        Authorization: `Bearer undefined`,
      },
    });
    expect(response).toEqual('mock data');
  });

  test('fetchSurveyData calls the correct API and returns data', async () => {
    const url = 'http://example.com/survey';
    axios.get.mockResolvedValueOnce(mockResponse);

    const response = await fetchSurveyData(url);

    expect(axios.get).toHaveBeenCalledWith(url);
    expect(response).toEqual('mock data');
  });

  test('postImages calls the correct API and returns data', async () => {
    const image = { uri: 'test-uri' };
    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await postImages(image);

    expect(axios.post).toHaveBeenCalledWith("https://tts-app.azurewebsites.net/api/upload-images/", image, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer undefined`
      },
    });
    expect(response).toEqual('mock data');
  });

  describe('uploadAudio', () => {
    const mockFileUri = 'file://path/to/audio.3gp';
    const mockRecordingLanguage = 'en';
    const mockTranslationLanguages = ['fr', 'de'];

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should successfully upload audio and return the response data', async () => {
      const mockToken = 'mock-token';
      const mockResponseData = { transcription: 'Transcribed text', translations: {} };
  
      AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponseData),
      });
  
      const result = await uploadAudio(mockFileUri, mockRecordingLanguage, mockTranslationLanguages);
  
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transcribe/'), {
        method: 'POST',
        body: expect.any(FormData),
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${mockToken}`,
        },
      });
  
      expect(result).toEqual(mockResponseData);
    });
  
    it('should handle invalid or expired token error', async () => {
      const mockToken = 'mock-token';
  
      AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Invalid or expired token' }),
      });
  
      const result = await uploadAudio(mockFileUri, mockRecordingLanguage, mockTranslationLanguages);
  
      expect(consoleErrorMock).toHaveBeenCalledWith("Invalid or expired token. Please log in again.");
      expect(result).toBeNull();
    });
  
    it('should handle server errors', async () => {
      const mockToken = 'mock-token';
  
      AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Some server error' }),
      });
  
      const result = await uploadAudio(mockFileUri, mockRecordingLanguage, mockTranslationLanguages);
  
      expect(consoleErrorMock).toHaveBeenCalledWith("Error from server:", 'Some server error');
      expect(result).toBeNull();
    });
  
    it('should handle network errors gracefully', async () => {
      const mockToken = 'mock-token';
  
      AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
  
      const result = await uploadAudio(mockFileUri, mockRecordingLanguage, mockTranslationLanguages);
  
      expect(consoleErrorMock).toHaveBeenCalledWith("Failed to upload file:", expect.any(Error));
      expect(result).toBeNull();
    });

    afterAll(() => {
      consoleErrorMock.mockRestore();
    });
  });
});
