import { renderHook, waitFor } from '@testing-library/react-native';
import useFetchProjects from '@hooks/useFetchProjects';
import { fetchProjectList } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';

jest.mock('@services/apiService');

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

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useFetchProjects(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(fetchProjectList).not.toHaveBeenCalled();
  });

  it('should not fetch when shouldFetch is false', async () => {
      { wrapper }
    const { result } = renderHook(() => useFetchProjects("area", "", "search", false), { wrapper });

    expect(fetchProjectList).not.toHaveBeenCalled();
    expect(result.current.projects).toEqual([]);
  });

  it('should fetch projects when shouldFetch is true', async () => {
    const mockProjects = [
      { project_id: '1', project_name: 'Project One' },
      { project_id: '2', project_name: 'Project Two' }
    ];
    fetchProjectList.mockResolvedValueOnce(mockProjects);

    const { result } = renderHook(() =>
      useFetchProjects("area", "", "search", true), { wrapper }
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.projects).toEqual([
        { project_id: '1', project_name: 'Project One', formattedName: '[1] Project One' },
        { project_id: '2', project_name: 'Project Two', formattedName: '[2] Project Two' }
      ]);
      expect(result.current.error).toBeNull();
    });

    expect(fetchProjectList).toHaveBeenCalledWith("area", "", "search");
  });

  it('should handle error when fetching projects', async () => {
    const errorMessage = 'Error fetching projects';
    fetchProjectList.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() =>
      useFetchProjects("area", "", "search", true), { wrapper }
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.projects).toEqual([]);
    });
  });

  it('should update when parameters change', async () => {
    const mockProjects1 = [{ project_id: '1', project_name: 'Project One' }];
    const mockProjects2 = [{ project_id: '2', project_name: 'Project Two' }];

    fetchProjectList
      .mockResolvedValueOnce(mockProjects1)
      .mockResolvedValueOnce(mockProjects2);

    const { result, rerender } = renderHook(
      ({ area, search, shouldFetch }) => useFetchProjects(area, "", search, shouldFetch),
      { wrapper, initialProps: { area: "area1", search: "", shouldFetch: true } },
    );

    await waitFor(() => {
      expect(result.current.projects).toEqual([
        { project_id: '1', project_name: 'Project One', formattedName: '[1] Project One' }
      ]);
    });

    rerender({ area: "area2", search: "", shouldFetch: true });

    await waitFor(() => {
      expect(result.current.projects).toEqual([
        { project_id: '2', project_name: 'Project Two', formattedName: '[2] Project Two' }
      ]);
    });
  });
});