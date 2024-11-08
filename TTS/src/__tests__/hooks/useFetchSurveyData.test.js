import { renderHook, waitFor } from '@testing-library/react-native';
import useFetchSurveyData from '@hooks/useFetchSurveyData';
import { fetchSurveyData } from '@services/apiService';

jest.mock('@services/apiService', () => ({
  fetchSurveyData: jest.fn(),
}));

describe('useFetchSurveyData', () => {
  const mockUrl = 'http://example.com/survey';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch survey data successfully', async () => {
    const mockData = { id: 1, name: 'Test Survey' };
    fetchSurveyData.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useFetchSurveyData(mockUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.surveyData).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }); 

    expect(result.current.surveyData).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network Error');
    fetchSurveyData.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useFetchSurveyData(mockUrl));

    expect(result.current.loading).toBe(true);
    expect(result.current.surveyData).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }); 

    expect(result.current.surveyData).toBe(null);
    expect(result.current.error).toBe(mockError.message);
  });

  it('should not fetch data if url is not provided', async () => {
    const { result } = renderHook(() => useFetchSurveyData(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.surveyData).toBe(null);
    expect(result.current.error).toBe(null);
  });
});
