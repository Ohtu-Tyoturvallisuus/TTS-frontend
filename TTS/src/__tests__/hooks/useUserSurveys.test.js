import { renderHook, waitFor } from '@testing-library/react-native';
import useUserSurveys from '@hooks/useUserSurveys';
import { getUserSurveys } from '@services/apiService';

jest.mock('@services/apiService', () => ({
  getUserSurveys: jest.fn(),
}));

describe('useUserSurveys', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUserSurveys());

    expect(result.current.userSurveys).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch surveys successfully', async () => {
    const mockSurveys = {
      filled_surveys: [
        { id: 1, project_name: 'Project A', created_at: '2024-11-01T10:00:00Z' },
        { id: 2, project_name: 'Project B', created_at: '2024-11-05T12:00:00Z' },
      ],
    };

    getUserSurveys.mockResolvedValueOnce(mockSurveys);

    const { result } = renderHook(() => useUserSurveys());

    expect(result.current.loading).toBe(true);
    expect(result.current.userSurveys).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.userSurveys).toEqual(mockSurveys.filled_surveys);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle error when fetching surveys', async () => {
    const errorMessage = 'Error fetching surveys';
    getUserSurveys.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useUserSurveys());

    expect(result.current.loading).toBe(true);
    expect(result.current.userSurveys).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.userSurveys).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it('should allow refetching surveys', async () => {
    const mockSurveys = {
      filled_surveys: [
        { id: 1, project_name: 'Project A', created_at: '2024-11-01T10:00:00Z' },
      ],
    };

    getUserSurveys.mockResolvedValueOnce(mockSurveys);

    const { result } = renderHook(() => useUserSurveys());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.userSurveys).toEqual(mockSurveys.filled_surveys);
    });

    const updatedSurveys = {
      filled_surveys: [
        { id: 1, project_name: 'Project A', created_at: '2024-11-01T10:00:00Z' },
        { id: 2, project_name: 'Project B', created_at: '2024-11-05T12:00:00Z' },
      ],
    };

    getUserSurveys.mockResolvedValueOnce(updatedSurveys);

    await result.current.fetchUserSurveys();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.userSurveys).toEqual(updatedSurveys.filled_surveys);
    });
  });
});
