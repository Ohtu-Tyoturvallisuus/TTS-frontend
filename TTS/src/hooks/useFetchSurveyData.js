import { useState, useEffect } from 'react';
import { fetchSurveyData } from '@services/apiService';

const useFetchSurveyData = (url) => {
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      console.log('Fetching survey data from:', url);
      try {
        const data = await fetchSurveyData(url);
        setSurveyData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { surveyData, error, loading };
};

export default useFetchSurveyData;
