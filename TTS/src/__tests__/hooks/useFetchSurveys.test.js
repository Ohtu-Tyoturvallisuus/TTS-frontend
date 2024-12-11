import { renderHook, waitFor } from '@testing-library/react-native';
import { UserContext } from '@contexts/UserContext';
import useFetchSurveys from '@hooks/useFetchSurveys';
import { fetchProject } from '@services/apiService';

jest.mock('@services/apiService', () => ({
  fetchProject: jest.fn(),
}));

describe('useFetchSurveys', () => {
  const mockProjectId = '12345';
  const mockAccountDatabaseId = 'mock-user-id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <UserContext.Provider value={{ accountDatabaseId: mockAccountDatabaseId }}>
      {children}
    </UserContext.Provider>
  );

  it('should fetch surveys successfully', async () => {
    const mockData = {
      surveys: [
        { id: 1, name: 'Survey 1', creator: mockAccountDatabaseId },
        { id: 2, name: 'Survey 2', creator: 'another-user-id' },
      ],
    };
    fetchProject.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useFetchSurveys(mockProjectId), {
      wrapper,
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.surveys).toEqual(
      mockData.surveys.filter((s) => s.creator === mockAccountDatabaseId)
    );
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network Error');
    fetchProject.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useFetchSurveys(mockProjectId), {
      wrapper,
    });

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
    const { result } = renderHook(() => useFetchSurveys(null), {
      wrapper,
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.surveys).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should set surveys to an empty array if project has no surveys', async () => {
    const mockData = {
      surveys: null,
    };
    fetchProject.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useFetchSurveys(mockProjectId), {
      wrapper,
    });

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
