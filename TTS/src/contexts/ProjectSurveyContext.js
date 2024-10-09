import React, { createContext, useState, useEffect } from 'react';

export const ProjectSurveyContext = createContext();

export const ProjectSurveyProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSurveyURL, setSelectedSurveyURL] = useState(null);

  useEffect(() => {
    if (selectedProject !== null) {
      console.log(`Project selected in context: ${selectedProject}`);
    }
  }, [selectedProject]);

  return (
    <ProjectSurveyContext.Provider value={{ selectedProject, setSelectedProject, selectedSurveyURL, setSelectedSurveyURL }}>
      {children}
    </ProjectSurveyContext.Provider>
  );
};