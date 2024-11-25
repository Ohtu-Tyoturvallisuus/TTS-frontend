import { useState, useEffect, useContext } from 'react';
import { fetchProjectList } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';

const useFetchProjects = (
  area = "",
  dataAreaId = "",
  search = "",
  shouldFetch = false
) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useContext(UserContext);

  useEffect(() => {
    if (!shouldFetch) {
      setProjects([]);
      return;
    }

    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching projects from apiService...');
        const data = await fetchProjectList(area, dataAreaId, search);
        const updatedProjects = data.map(project => ({
          ...project,
          formattedName: `[${project.project_id}] ${project.project_name}`
        }));
        setProjects(updatedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    accessToken && loadProjects();
  }, [area, dataAreaId, search, shouldFetch]);

  return { projects, loading, error };
};

export default useFetchProjects;
