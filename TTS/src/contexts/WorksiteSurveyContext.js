import React, { createContext, useState } from 'react';

export const WorksiteSurveyContext = createContext();

export const WorksiteSurveyProvider = ({ children }) => {
  const [selectedWorksite, setSelectedWorksite] = useState(null);
  const [selectedSurveyURL, setSelectedSurveyURL] = useState(null);

  return (
    <WorksiteSurveyContext.Provider value={{ selectedWorksite, setSelectedWorksite, selectedSurveyURL, setSelectedSurveyURL }}>
      {children}
    </WorksiteSurveyContext.Provider>
  );
};