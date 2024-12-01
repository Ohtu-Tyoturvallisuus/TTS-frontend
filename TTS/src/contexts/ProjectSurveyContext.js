import React, { createContext, useState } from 'react';

export const ProjectSurveyContext = createContext();

export const ProjectSurveyProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSurveyURL, setSelectedSurveyURL] = useState(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  const resetProjectAndSurvey = () => {
    console.log('Resetting project and surveyURL from context');
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
