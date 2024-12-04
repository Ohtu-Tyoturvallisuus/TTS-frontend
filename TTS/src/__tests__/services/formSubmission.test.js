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
  const mockTranslate = jest.fn().mockImplementation(key => key);

  const mockAlert = jest.fn();
  global.alert = mockAlert;

  const project = { id: 1 };
  const taskInfo = {
    task: ['Installation'],
    description: 'New installation task',
    scaffold_type: ['Work Scaffold'],
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

    await submitForm(project, taskInfo, formData, mockTranslate);

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
  });

  it('should throw an error if fields are empty', async () => {
    const incompleteTaskInfo = {
      task: 'Installation',
      description: '',
      scaffold_type: 'Work Scaffold',
    };

    await expect(submitForm(project, incompleteTaskInfo, formData, mockTranslate))
      .rejects.toThrow('Some fields are empty');
  });

  it('should throw an error if a task field is null', async () => {
    const incompleteTaskInfo = {
      task: null,
      description: 'Valid description',
      scaffold_type: 'Scaffold Type',
    };

    await expect(submitForm(project, incompleteTaskInfo, formData, mockTranslate))
      .rejects.toThrow('Some fields are empty');
  });

  it('should throw an error if a task field is empty list', async () => {
    const incompleteTaskInfo = {
      task: [],
      description: 'Valid description',
      scaffold_type: 'Scaffold Type',
    };

    await expect(submitForm(project, incompleteTaskInfo, formData, mockTranslate))
      .rejects.toThrow('Some fields are empty');
  });

  it('should throw an error if a scaffold_type field is not string', async () => {
    const incompleteTaskInfo = {
      task: ['Installation'],
      description: 'Valid description',
      scaffold_type: [6],
    };

    await expect(submitForm(project, incompleteTaskInfo, formData, mockTranslate))
      .rejects.toThrow('Some fields are empty');
  });

  it('should replace null values for RiskNote status and description', async () => {
    const newFormData = {
      personal_protection: {
        description: null,
        status: null,
        risk_type: 'scaffolding',
        images: [],
      },
    };
    postNewSurvey.mockResolvedValueOnce({ id: 123 });
    postRiskNotes.mockResolvedValueOnce();

    await submitForm(project, taskInfo, newFormData, mockTranslate);

    expect(postNewSurvey).toHaveBeenCalledWith(
      project.id,
      taskInfo.description,
      taskInfo.task,
      taskInfo.scaffold_type,
    );

    expect(postRiskNotes).toHaveBeenCalledWith(123, expect.arrayContaining([
      expect.objectContaining({
        note: 'personal_protection',
        description: '',
        status: '',
        risk_type: 'scaffolding',
        images: [],
      }),
    ]));
  });

  it('should alert on submission error', async () => {
    postNewSurvey.mockRejectedValueOnce(new Error('Network Error'));

    await expect(submitForm(project, taskInfo, formData, mockTranslate))
      .rejects.toThrow('Network Error');

    expect(mockAlert).toHaveBeenCalledWith(mockTranslate('riskform.errorSubmitting'));
  });

  it('should alert for empty fields error', async () => {
    postNewSurvey.mockImplementationOnce(() => Promise.reject(new Error('Some fields are empty')));

    await expect(submitForm(project, taskInfo, formData, mockTranslate)).
      rejects.toThrow('Some fields are empty');

    expect(mockAlert).toHaveBeenCalledWith(mockTranslate('riskform.emptyFieldsError'));
  });

  it('should handle case where images are not provided or empty', async () => {
    const newTaskInfo = {
      task: ['Installation'],
      description: 'New installation task',
      scaffold_type: ['Work Scaffold'],
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
  
    await submitForm(project, newTaskInfo, newFormData, mockTranslate);

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
