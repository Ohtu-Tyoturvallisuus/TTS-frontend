import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchProjects = (local_ip) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    // Fetch projects from server
    console.log('Fetching projects from api/projects...');
    axios.get(`http://${local_ip}:8000/api/projects/`)
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          const updatedProjects = data.map(project => ({
            ...project,
            formattedName: `[${project.project_id}] ${project.project_name}`
          }));
          setProjects(updatedProjects);
        } else {
          console.error('Error fetching projects:', data);
        }
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, [local_ip]);

  return projects;
};

export default useFetchProjects;