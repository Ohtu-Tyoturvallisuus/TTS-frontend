import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSurveyData = (url) => {
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    axios.get(url)
      .then(response => {
        const data = response.data;
        try {
          // Ensure risks field is valid JSON
          const risks = data.risks ? JSON.parse(data.risks) : {};
          setSurveyData({ ...data, risks });
        } catch (e) {
          setError('Invalid risks data');
        }
      })
      .catch(error => {
        setError(error.message);
      });
  }, [url]);

  return { surveyData, error };
};

export default useFetchSurveyData;