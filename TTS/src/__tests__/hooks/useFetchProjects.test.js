import { renderHook, waitFor } from '@testing-library/react-native';
import useFetchProjects from '@hooks/useFetchProjects';
import { fetchProjectList } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';

jest.mock('@services/apiService', () => ({
  fetchProjectList: jest.fn(),
}));

describe('useFetchProjects', () => {
  const mockUserContext = {
    accessToken: 'mockToken',
  };

  const wrapper = ({ children }) => (
    <UserContext.Provider value={mockUserContext}>
      {children}
    </UserContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch projects successfully', async () => {
    const mockProjects = [
      { project_id: '1', project_name: 'Project One' },
      { project_id: '2', project_name: 'Project Two' },
    ];

    fetchProjectList.mockResolvedValueOnce(mockProjects);

    const { result } = renderHook(() => useFetchProjects(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.projects).toEqual([
        { project_id: '1', project_name: 'Project One', formattedName: '[1] Project One' },
        { project_id: '2', project_name: 'Project Two', formattedName: '[2] Project Two' },
      ]);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle error when fetching projects', async () => {
    const errorMessage = 'Error fetching projects';

    fetchProjectList.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFetchProjects(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.projects).toEqual([]);
      expect(result.current.error).toBe(errorMessage);
    });
  });
});
