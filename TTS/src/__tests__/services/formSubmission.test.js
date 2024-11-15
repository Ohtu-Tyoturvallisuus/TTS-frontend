import { submitForm } from '@services/formSubmission';
import { postNewSurvey, postRiskNotes } from '@services/apiService';
import { uploadImages } from '@services/imageUpload';

jest.mock('@services/apiService', () => ({
  postNewSurvey: jest.fn(),
  postRiskNotes: jest.fn(),
}));

jest.mock('@services/imageUpload', () => ({
  uploadImages: jest.fn(),
}));

describe('submitForm', () => {
  const mockSetShowSuccessAlert = jest.fn();
  const mockTranslate = jest.fn().mockImplementation(key => key);

  const mockAlert = jest.fn();
  global.alert = mockAlert;

  const project = { id: 1 };
  const taskInfo = {
    task: 'Installation',
    description: 'New installation task',
    scaffold_type: 'Work Scaffold',
  };
  
  const formData = {
    personal_protection: {
      description: 'Using protective gear',
      status: 'checked',
      risk_type: 'scaffolding',
      images: [
        {'blobName': 'image1.png', 'isLandscape': true},
        {'blobName': 'image2.png', 'isLandscape': false}
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit form successfully', async () => {
    postNewSurvey.mockResolvedValueOnce({ id: 123 });
    uploadImages.mockResolvedValueOnce(['blob1', 'blob2']);
    postRiskNotes.mockResolvedValueOnce();

    await submitForm(project, taskInfo, formData, mockSetShowSuccessAlert, mockTranslate);

    expect(postNewSurvey).toHaveBeenCalledWith(
      project.id,
      taskInfo.description,
      taskInfo.task,
      taskInfo.scaffold_type,
    );

    expect(uploadImages).toHaveBeenCalledWith(formData.personal_protection.images, 'personal_protection');

    expect(postRiskNotes).toHaveBeenCalledWith(123, expect.arrayContaining([
      expect.objectContaining({
        note: 'personal_protection',
        description: 'Using protective gear',
        status: 'checked',
        risk_type: 'scaffolding',
        images: [
          expect.objectContaining({ blobName: 'blob1', isLandscape: expect.any(Boolean) }),
          expect.objectContaining({ blobName: 'blob2', isLandscape: expect.any(Boolean) }),
        ],
      }),
    ]));

    expect(mockSetShowSuccessAlert).toHaveBeenCalledWith(true);
  });

  it('should throw an error if fields are empty', async () => {
    const incompleteTaskInfo = {
      task: 'Installation',
      description: '',
      scaffold_type: 'Work Scaffold',
    };

    await expect(submitForm(project, incompleteTaskInfo, formData, mockSetShowSuccessAlert, mockTranslate))
      .rejects.toThrow('Some fields are empty');
    
    expect(mockSetShowSuccessAlert).not.toHaveBeenCalled();
  });

  it('should alert on submission error', async () => {
    postNewSurvey.mockRejectedValueOnce(new Error('Network Error'));

    await expect(submitForm(project, taskInfo, formData, mockSetShowSuccessAlert, mockTranslate))
      .rejects.toThrow('Network Error');

    expect(mockSetShowSuccessAlert).not.toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith(mockTranslate('riskform.errorSubmitting'));
  });

  it('should alert for empty fields error', async () => {
    postNewSurvey.mockImplementationOnce(() => Promise.reject(new Error('Some fields are empty')));

    await expect(submitForm(project, taskInfo, formData, mockSetShowSuccessAlert, mockTranslate)).
      rejects.toThrow('Some fields are empty');

    expect(mockSetShowSuccessAlert).not.toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith(mockTranslate('riskform.emptyFieldsError'));
  });

  it('should handle case where images are not provided or empty', async () => {
    const newTaskInfo = {
      task: 'Installation',
      description: 'New installation task',
      scaffold_type: 'Work Scaffold',
    };
  
    const newFormData = {
      personal_protection: {
        description: 'Using protective gear',
        status: 'checked',
        risk_type: 'scaffolding',
        images: [],
      },
    };
  
    postNewSurvey.mockResolvedValueOnce({ id: 123 });
  
    await submitForm(project, newTaskInfo, newFormData, mockSetShowSuccessAlert, mockTranslate);

    expect(postRiskNotes).toHaveBeenCalledWith(123, expect.arrayContaining([
      expect.objectContaining({
        note: 'personal_protection',
        description: 'Using protective gear',
        status: 'checked',
        risk_type: 'scaffolding',
        images: [],
      }),
    ]));

    expect(uploadImages).not.toHaveBeenCalled();
  });
});
