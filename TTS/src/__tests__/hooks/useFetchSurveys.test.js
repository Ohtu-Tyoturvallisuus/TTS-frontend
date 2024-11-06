import { renderHook, waitFor } from '@testing-library/react-native';
import useFetchSurveys from '@hooks/useFetchSurveys';
import { fetchProject } from '@services/apiService';

jest.mock('@services/apiService', () => ({
  fetchProject: jest.fn(),
}));

describe('useFetchSurveys', () => {
  const mockProjectId = '12345';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch surveys successfully', async () => {
    const mockData = {
      surveys: [{ id: 1, name: 'Survey 1' }, { id: 2, name: 'Survey 2' }],
    };
    fetchProject.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useFetchSurveys(mockProjectId));

    expect(result.current.loading).toBe(true);
    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.surveys).toEqual(mockData.surveys);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network Error');
    fetchProject.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useFetchSurveys(mockProjectId));

    expect(result.current.loading).toBe(true);
    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(mockError.message);
  });

  it('should not fetch surveys if projectId is not provided', async () => {
    const { result } = renderHook(() => useFetchSurveys(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should set surveys to an empty array if project has no surveys', async () => {
    const mockData = {
      surveys: null,
    };
    fetchProject.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useFetchSurveys(mockProjectId));

    expect(result.current.loading).toBe(true);
    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});
