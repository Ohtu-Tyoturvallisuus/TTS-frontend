import { useState, useEffect, useContext } from 'react';
import { fetchProject } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';

const useFetchSurveys = (projectId) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accountDatabaseId } = useContext(UserContext);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const loadSurveys = async () => {
      setLoading(true);
      setError(null);
      try {
        const project = await fetchProject(projectId);
        console.log('Project:', project.projectId);
        const allSurveys = project.surveys || [];
        const filteredSurveys = allSurveys.filter((s) => {
          console.log('Filtering user surveys...');
          return String(s.creator) === accountDatabaseId;
        });
        console.log('Setting surveys to:', filteredSurveys)
        setSurveys(filteredSurveys);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, [projectId]);

  return { surveys, loading, error };
};

export default useFetchSurveys;
