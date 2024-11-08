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

  const resetProjectAndSurvey = () => {
    console.log('Resetting project and survey URL');
    setSelectedProject(null);
    setSelectedSurveyURL(null);
  };

  return (
    <ProjectSurveyContext.Provider 
      value={{ 
        selectedProject, 
        setSelectedProject, 
        selectedSurveyURL, 
        setSelectedSurveyURL, 
        resetProjectAndSurvey
      }}
    >
      {children}
    </ProjectSurveyContext.Provider>
  );
};