import axios from 'axios';
import {
  signIn,
  fetchProjectList,
  fetchProject,
  getAccountsBySurvey,
  patchSurveyCompletion,
  postNewSurvey,
  postRiskNotes,
  postImages,
  retrieveImage,
  fetchSurveyData,
  retrieveIdParams,
  getUserProfile,
  getUserSurveys,
  uploadAudio,
  translateText,
  getSurveyByAccessCode,
  validateSurvey
} from '@services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

global.FileReader = jest.fn().mockImplementation(() => ({
  onloadend: jest.fn(),
  onerror: jest.fn(),
  readAsDataURL: jest.fn(),
}));

global.fetch = jest.fn();

const API_BASE_URL = 'https://tts-app.azurewebsites.net/api/'

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

  // Add these tests in the 'fetchProjectList' section:
test('fetchProjectList with filters calls API with correct query params', async () => {
  axios.get.mockResolvedValueOnce({ data: 'filtered data' });

  const response = await fetchProjectList("AL31", "dataArea1", "searchTerm");

  expect(axios.get).toHaveBeenCalledWith(
    expect.stringContaining('projects/?area_filter=AL31&data_area_id=dataArea1&search=searchTerm')
  );
  expect(response).toEqual('filtered data');
});

test('fetchProjectList handles empty filters correctly', async () => {
  axios.get.mockResolvedValueOnce({ data: 'unfiltered data' });

  const response = await fetchProjectList();

  expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('projects/?'));
  expect(response).toEqual('unfiltered data');
});

  test('postNewSurvey calls the correct API and returns data', async () => {
    const mockProjectId = 1;
    const mockDesc = 'Survey description';
    const mockDescTranslations = { fi: 'Kuvaus', sv: 'Beskrivning' };
    const mockTask = ['Task'];
    const mockScaffoldType = ['Type'];
    const mockLanguage = 'en';
    const mockLanguageOptions = ['fi', 'sv'];
    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await postNewSurvey(mockProjectId, mockDesc, mockDescTranslations, mockTask, mockScaffoldType, mockLanguage, mockLanguageOptions);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(`/projects/${mockProjectId}/surveys/`), {
      description: mockDesc,
      description_translations: mockDescTranslations,
      task: mockTask,
      scaffold_type: mockScaffoldType,
      language: mockLanguage,
      translation_languages: mockLanguageOptions,
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

  describe('translateText', () => {
    const mockText = 'Hello';
    const mockFrom = 'en';
    const mockTo = ['fi'];
    const mockToken = 'mock-token';
    const mockResponseData = { translations: [{ text: 'Hei' }] };

    beforeEach(() => {
      AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully translate text and return the response data', async () => {
      axios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await translateText(mockText, mockFrom, mockTo);

      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/translate/'), {
        text: mockText,
        from: mockFrom,
        to: mockTo,
      }, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });

      expect(result).toEqual(mockResponseData);
    });

    it('should use default parameters for "from" and "to" if not provided', async () => {
      axios.post.mockResolvedValueOnce({ data: mockResponseData });

      const result = await translateText(mockText);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/translate/'),
        {
          text: mockText,
          from: 'fi', // default value
          to: ['en'], // default value
        },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );

      expect(result).toEqual(mockResponseData);
    });

    it('should handle errors gracefully', async () => {
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Translation error');

      axios.post.mockRejectedValueOnce(mockError);

      await expect(translateText(mockText, mockFrom, mockTo)).rejects.toThrow(mockError);

      expect(consoleErrorMock).toHaveBeenCalledWith('Error translating text:', mockError);

      consoleErrorMock.mockRestore();
    });
  });

  describe('getUserSurveys', () => {
    it('should fetch user surveys with the correct token and return the response data', async () => {
      const mockToken = 'mockToken';
      const mockResponseData = {
        filled_surveys: [
          {
            id: '1',
            created_at: '2024-11-15T09:45:00',
            risk_notes: 'Sample notes',
            project_name: 'Project A',
            project_id: '123',
            description: 'Test description',
            scaffold_type: 'Type A',
            task: 'Sample task',
          },
        ],
      };

      axios.get.mockResolvedValueOnce({ data: mockResponseData });

      const surveys = await getUserSurveys(mockToken);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('filled-surveys/'),
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` }
        })
      );

      expect(surveys).toEqual(mockResponseData);
    });

    it('should handle errors correctly if the API call fails', async () => {
      const mockToken = 'mockToken';

      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(getUserSurveys(mockToken)).rejects.toThrow('Network Error');
    });
  });

  describe('getSurveyByAccessCode', () => {
    it('should fetch a survey by access code and return the response data', async () => {
      const mockAccessCode = 'testAccessCode';
      const mockResponseData = {
        id: '1',
        name: 'Survey A',
        description: 'A test survey',
        created_at: '2024-11-15T10:00:00',
      };

      axios.get.mockResolvedValueOnce({ data: mockResponseData });

      const survey = await getSurveyByAccessCode(mockAccessCode);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`surveys/code/${mockAccessCode}`)
      );

      expect(survey).toEqual(mockResponseData);
    });

    it('should handle errors correctly if the API call fails', async () => {
      const mockAccessCode = 'testAccessCode';

      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(getSurveyByAccessCode(mockAccessCode)).rejects.toThrow('Network Error');
    });
  });

  describe('joinSurvey', () => {
    it('should join a survey using access code and return the response data', async () => {
      const mockAccessCode = 'testAccessCode';
      const mockToken = 'mockToken';
      const mockResponseData = { success: true, message: 'Successfully joined the survey.' };

      axios.post.mockResolvedValueOnce({ data: mockResponseData });

      const response = await validateSurvey({ access_code: mockAccessCode, accessToken: mockToken });

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining(`surveys/validate/${mockAccessCode}/`),
        {},
        expect.objectContaining({
          headers: { Authorization: `Bearer ${mockToken}` },
        })
      );

      expect(response).toEqual(mockResponseData);
    });

    it('should handle errors correctly if the API call fails', async () => {
      const mockAccessCode = 'testAccessCode';
      const mockToken = 'mockToken';

      axios.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(validateSurvey({ access_code: mockAccessCode, accessToken: mockToken })).rejects.toThrow('Network Error');
    });
  });
});

describe('API Module - retrieveImage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve image and convert it to base64 on success', async () => {
    const mockImage = 'image.jpg';
    const mockImageData = new Blob(['dummy data'], { type: 'image/jpeg' });

    axios.get.mockResolvedValue({ data: mockImageData });

    global.FileReader = jest.fn(() => ({
      readAsDataURL: jest.fn(function () {
        this.result = 'data:image/jpeg;base64,dummydata';
        this.onloadend();
      }),
      onloadend: jest.fn(),
      onerror: jest.fn(),
    }));

    const result = await retrieveImage(mockImage);

    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}retrieve-image/?blob_name=images/${mockImage}`, {'responseType': 'blob'});
    expect(result).toBe('data:image/jpeg;base64,dummydata');
  });


  it('should handle errors if axios request fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to retrieve image'));

    const result = await retrieveImage('image.jpg');

    expect(axios.get).toHaveBeenCalledWith(
      'https://tts-app.azurewebsites.net/api/retrieve-image/?blob_name=images/image.jpg',
      expect.objectContaining({
        responseType: 'blob',
      })
    );
    expect(result).toBeNull();
  });
});

describe('API Module - patchSurveyCompletion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully patch survey completion', async () => {
    const mockSurveyId = 123;
    const mockParticipantsCount = 5;
    const mockToken = 'mockToken';
    const mockResponseData = { success: true, message: 'Survey marked as completed.' };

    AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
    axios.patch.mockResolvedValueOnce({ data: mockResponseData });

    const result = await patchSurveyCompletion(mockSurveyId, mockParticipantsCount);

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining(`/surveys/${mockSurveyId}/`),
      {
        is_completed: true,
        number_of_participants: mockParticipantsCount,
      },
      expect.objectContaining({
        headers: { Authorization: `Bearer ${mockToken}` },
      })
    );

    expect(result).toEqual(mockResponseData);
  });

  it('should handle errors correctly if the API call fails', async () => {
    const mockSurveyId = 123;
    const mockParticipantsCount = 5;
    const mockToken = 'mockToken';

    AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
    axios.patch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(patchSurveyCompletion(mockSurveyId, mockParticipantsCount)).rejects.toThrow('Network Error');
  });
});

describe('API Module - getAccountsBySurvey', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch accounts by survey ID and return the response data', async () => {
    const mockSurveyId = 123;
    const mockResponseData = [
      { id: 'account1', name: 'User 1', acknowledged_at: '2024-12-01T10:00:00Z' },
      { id: 'account2', name: 'User 2', acknowledged_at: '2024-12-02T11:00:00Z' },
    ];

    axios.get.mockResolvedValueOnce({ data: mockResponseData });

    const result = await getAccountsBySurvey(mockSurveyId);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(`/survey-accounts/${mockSurveyId}`)
    );

    expect(result).toEqual(mockResponseData);
  });

  it('should handle errors correctly if the API call fails', async () => {
    const mockSurveyId = 123;

    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(getAccountsBySurvey(mockSurveyId)).rejects.toThrow('Network Error');
  });
});
