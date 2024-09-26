import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSurveyData = (surveyAPIURL) => {
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (surveyAPIURL) {
      axios.get(surveyAPIURL)
        .then(response => {
          console.log('Survey data:', response.data);
          const risks = JSON.parse(response.data.risks);
          const data = {
            title: response.data.title,
            risks: risks
          };
          setSurveyData(data);
        })
        .catch(error => {
          console.error('Error fetching survey data:', error);
          setError(error);
        });
    }
  }, [surveyAPIURL]);

  return { surveyData, error };
};

export default useFetchSurveyData;