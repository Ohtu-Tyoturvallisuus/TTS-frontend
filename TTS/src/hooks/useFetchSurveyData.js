import { useState, useEffect } from 'react';
import { fetchSurveyData } from '../services/apiService';

const useFetchSurveyData = (url) => {
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    console.log('Fetching survey data from:', url);
    fetchSurveyData(url)
      .then(data => {
        setSurveyData(data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [url]);

  return { surveyData, error };
};

export default useFetchSurveyData;