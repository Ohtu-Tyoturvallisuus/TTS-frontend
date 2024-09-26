import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchWorksites = (local_ip) => {
  const [worksites, setWorksites] = useState([]);

  useEffect(() => {
    // Fetch worksites from server
    axios.get(`http://${local_ip}:8000/api/worksites/`)
      .then(response => {
        const data = response.data;
        // Ensure the data is in an array format
        if (Array.isArray(data)) {
          setWorksites(data);
        } else {
          setWorksites([data]);
        }
      })
      .catch(error => console.error('Error fetching worksites:', error));
  }, [local_ip]);

  return worksites;
};

export default useFetchWorksites;