import { useState, useEffect } from 'react';
import { fetchSurveyData } from '@services/apiService';

const useFetchSurveyData = (url) => {
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    console.log('Fetching survey data from:', url);
    fetchSurveyData(url)
      .then(data => {
        setSurveyData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [url]);

  return { surveyData, error, loading };
};

export default useFetchSurveyData;
