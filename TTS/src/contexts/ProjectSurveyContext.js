import React, { createContext, useState, useEffect } from 'react';

export const ProjectSurveyContext = createContext();

export const ProjectSurveyProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSurveyURL, setSelectedSurveyURL] = useState(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  useEffect(() => {
    if (selectedProject !== null) {
      console.log(`Project selected in ProjectSurveyContext: ${selectedProject}`);
    }
  }, [selectedProject]);

  const resetProjectAndSurvey = () => {
    console.log('Resetting project and survey from context');
    setSelectedProject(null);
    setSelectedSurveyURL(null);
    setSelectedSurveyId(null);
  };

  return (
    <ProjectSurveyContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        selectedSurveyURL,
        setSelectedSurveyURL,
        selectedSurveyId,
        setSelectedSurveyId,
        resetProjectAndSurvey
      }}
    >
      {children}
    </ProjectSurveyContext.Provider>
  );
};
