import { postNewSurvey, postRiskNotes } from './apiService';
import { uploadImages } from './imageUpload';

const validateTaskInfo = (fields) => {
  const validatedFields = {};
  let hasEmptyField = false;

  Object.keys(fields).forEach(key => {
    validatedFields[key] = (fields[key] != null ? fields[key].trim() : '') || '';
    if (validatedFields[key] === '') {
      hasEmptyField = true;
    }
  });

  if (hasEmptyField) {
    throw new Error('Some fields are empty');
  }

  return validatedFields;
};

/**
 * Submits a form by validating fields, posting a new survey instance, uploading images, 
 * and posting risk notes. Displays a success alert upon successful submission.
 */
export const submitForm = async (project, taskInfo, formData, setShowSuccessAlert, t) => {
  try {
    const validatedSurveyData = validateTaskInfo(taskInfo);

    // POST a new survey instance
    const response = await postNewSurvey(
      project.id,
      validatedSurveyData.description,
      validatedSurveyData.task,
      validatedSurveyData.scaffold_type
    );
    console.log('Server response:', response);
    const surveyId = response.id;

    const riskNotes = await Promise.all(Object.keys(formData).map(async key => {
      const { description, status, risk_type, images } = formData[key];

      const trimmedDescription = (description != null ? description.trim() : '');
      const trimmedStatus = (status != null ? status.trim() : '');

      let blobNames = [];
      if (images && images.length > 0) {
        blobNames = await uploadImages(images, key);
      }

      return {
        note: key,
        description: trimmedDescription,
        status: trimmedStatus,
        risk_type: risk_type,
        images: blobNames,
      };
    }));

    await postRiskNotes(surveyId, riskNotes);
    setShowSuccessAlert(true);
  } catch (error) {
    console.error('Error during form submission:', error);
    if (error.message === 'Some fields are empty') {
      alert(t('riskform.emptyFieldsError'));
    } else {
      alert(t('riskform.errorSubmitting'));
    }
    throw error;
  }
};