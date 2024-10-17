import { useState, useEffect } from 'react';
import { fetchProject } from '@services/apiService';

const useFetchSurveys = (projectId) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurveys = async () => {
      setLoading(true);
      setError(null);
      try {
        const project = await fetchProject(projectId);
        console.log('Project:', project);
        setSurveys(project.surveys || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadSurveys();
    }
  }, [projectId]);

  return { surveys, loading, error };
};

export default useFetchSurveys;