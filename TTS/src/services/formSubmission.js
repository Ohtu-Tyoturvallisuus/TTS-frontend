import { postNewSurvey, postRiskNotes } from './apiService';
import { uploadImages } from './imageUpload';

const validateTaskInfo = (fields) => {
  const validatedFields = {};
  let hasEmptyField = false;

  Object.keys(fields).forEach(key => {
    const value = fields[key];

    if (typeof value === 'string') {
      validatedFields[key] = value.trim() || '';
    } else if (Array.isArray(value)) {
      validatedFields[key] = value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
      if (validatedFields[key].length === 0) {
        validatedFields[key] = '';
      }
    } else {
      validatedFields[key] = '';
    }

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
export const submitForm = async (project, taskInfo, formData, t) => {
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
      let imageDetails = [];
      if (images && images.length > 0) {
        blobNames = await uploadImages(images, key);

        imageDetails = blobNames.map((blobName, index) => ({
          blobName,
          isLandscape: images[index]?.isLandscape || false,
        }))
      }

      return {
        note: key,
        description: trimmedDescription,
        status: trimmedStatus,
        risk_type: risk_type,
        images: imageDetails,
      };
    }));

    await postRiskNotes(surveyId, riskNotes);
    return response;
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
