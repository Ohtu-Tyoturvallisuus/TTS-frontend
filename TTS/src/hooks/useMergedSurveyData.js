import { useState, useEffect } from 'react';
import useFetchSurveyData from './useFetchSurveyData';

const useMergedSurveyData = (prevSurveyUrl, initialFormData) => {
  const { surveyData, error } = useFetchSurveyData(prevSurveyUrl);
  const [mergedFormData, setMergedFormData] = useState(initialFormData);
  const [task, setTask] = useState('');
  const [scaffoldType, setScaffoldType] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [isMerged, setIsMerged] = useState(false);

  useEffect(() => {
    if (surveyData) {
      setTask(surveyData.task);
      setScaffoldType(surveyData.scaffold_type);
      setTaskDesc(surveyData.description);
      const updatedFormData = { ...initialFormData };
      surveyData.risk_notes.forEach(note => {
        if (updatedFormData[note.note]) {
          updatedFormData[note.note].description = note.description || '';
          updatedFormData[note.note].status = note.status || '';
        }
      });
      setMergedFormData(updatedFormData);
      setIsMerged(true);
    }
  }, [surveyData]);

  return { 
    mergedFormData, 
    taskDetails: { task, scaffoldType, taskDesc }, 
    error ,
    isMerged
  };
};

export default useMergedSurveyData;
