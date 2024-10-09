import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSurveyData = (url) => {
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    console.log('Fetching survey data from:', url);
    axios.get(url)
      .then(response => {
        const data = response.data;
        //Implement fetching of riskNote descriptions
      })
      .catch(error => {
        setError(error.message);
      });
  }, [url]);

  return { surveyData, error };
};

export default useFetchSurveyData;