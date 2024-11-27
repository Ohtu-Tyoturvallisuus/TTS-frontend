import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FilledRiskForm from '@components/risk-form/FilledRiskForm';
import { retrieveImage } from '@services/apiService'

jest.mock('@components/take-picture/Image', () => {
  const { View } = require('react-native');
  const mockImage = ({ testID }) => <View testID={testID} />;
  return mockImage;
});

jest.mock('@services/apiService', () => ({
  retrieveImage: jest.fn(),
}));

describe('FilledRiskForm component', () => {
  const setup = (overrides = {}) => {
    const mockHandleSubmit = jest.fn();
    const props = {
      formData: {
        hazard1: { status: 'checked', description: 'Hazard description 1', images: [{ uri: 'image1.jpg', isLandscape: false }] },
        hazard2: { status: 'notRelevant', description: 'Hazard description 2', images: [] },
      },
      projectName: 'Project A',
      projectId: '12345',
      task: ['task1'],
      scaffoldType: ['type1'],
      taskDesc: 'This is a sample task description',
      handleSubmit: mockHandleSubmit,
      ...overrides,
    };
    return { ...render(<FilledRiskForm {...props} />), mockHandleSubmit };
  };

  it('opens modal when "Show preview" button is pressed', () => {
    const { getByText, queryByText } = setup();

    expect(queryByText('Project A')).toBeNull();

    fireEvent.press(getByText('filledriskform.preview'));
    expect(getByText('Project A')).toBeTruthy();
    expect(getByText('12345')).toBeTruthy();
  });

  it('displays relevant project, task, and scaffold information', () => {
    const { getByText } = setup();

    fireEvent.press(getByText('filledriskform.preview'));

    expect(getByText('Project A')).toBeTruthy();
    expect(getByText('12345')).toBeTruthy();
    expect(getByText('This is a sample task description')).toBeTruthy();
  });

  it('renders only checked risk notes', () => {
    const { getByText, queryByText } = setup();

    fireEvent.press(getByText('filledriskform.preview'));

    expect(getByText('Hazard description 1')).toBeTruthy();
    expect(queryByText('Hazard description 2')).toBeNull();
  });

  it('calls handleSubmit when "submit" button is pressed', () => {
    const { getByText, mockHandleSubmit } = setup();

    fireEvent.press(getByText('filledriskform.preview'));

    fireEvent.press(getByText('riskform.submit'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('closes modal when "edit" button is pressed', () => {
    const { getByText, queryByText } = setup();

    fireEvent.press(getByText('filledriskform.preview'));

    expect(getByText('Project A')).toBeTruthy();

    fireEvent.press(getByText('filledriskform.edit'));
    expect(queryByText('Project A')).toBeNull();
  });

  it('renders RiskImage components for each image in checked risk notes', () => {
    const { getByText, getByTestId } = setup();
  
    fireEvent.press(getByText('filledriskform.preview'));
  
    expect(getByTestId('risk-image-0')).toBeTruthy();
  });

  it('renders without crashing when all props are null', () => {
    const props = {};
    const { getByText } = render(<FilledRiskForm {...props} />);

    fireEvent.press(getByText('filledriskform.preview'));

    expect(getByText('filledriskform.preview')).toBeTruthy();
    expect(getByText('riskform.submit')).toBeTruthy();

    expect(getByText('filledriskform.norisks')).toBeTruthy();
  });

  it('renders the "no risks" message when no relevant risk notes are present', () => {
    const { getByText } = setup({
      formData: {},
    });
  
    fireEvent.press(getByText('filledriskform.preview'));
  
    expect(getByText('filledriskform.norisks')).toBeTruthy();
  });

  it('does not render checked hazard descriptions when status is not "checked"', () => {
    const { getByText, queryByText } = setup({
      formData: {
        hazard1: { status: 'notRelevant', description: 'Hazard description 1', images: [] },
        hazard2: { status: 'notRelevant', description: 'Hazard description 2', images: [] },
      },
    });
  
    fireEvent.press(getByText('filledriskform.preview'));
  
    expect(queryByText('Hazard description 1')).toBeNull();
    expect(queryByText('Hazard description 2')).toBeNull();
  });  

  it('renders translated text for riskform keys', () => {
    const { getByText } = setup();
  
    fireEvent.press(getByText('filledriskform.preview'));
  
    expect(getByText('riskform.projectName:')).toBeTruthy();
    expect(getByText('riskform.submit')).toBeTruthy();
  });  

  it('renders the submit view when submitted is true', () => {
    const { getByText } = setup({
      submitted: true,
    });
  
    fireEvent.press(getByText('filledriskform.project:'));

    expect(getByText('closebutton.close')).toBeTruthy();
  });
  
  it('closes modal when edit button is pressed', () => {
    const { getByText, queryByText } = setup();
  
    fireEvent.press(getByText('filledriskform.preview'));
    expect(getByText('Project A')).toBeTruthy();
  
    fireEvent.press(getByText('filledriskform.edit'));
    expect(queryByText('Project A')).toBeNull();
  });
  
  it('does not render RiskImage components when there are no images in checked risks', () => {
    const { getByText, queryByTestId } = setup({
      formData: {
        hazard1: { status: 'checked', description: 'Hazard description 1', images: [] },
      },
    });
  
    fireEvent.press(getByText('filledriskform.preview'));
  
    expect(queryByTestId('risk-image-0')).toBeNull();
  });

  it('filters relevant risk notes with status "checked"', () => {
    const formData = {
      hazard1: { status: 'checked', description: 'Hazard 1 description', images: [] },
      hazard2: { status: 'notRelevant', description: 'Hazard 2 description', images: [] },
    };
    const { getByText, queryByText } = setup({ formData });

    fireEvent.press(getByText('filledriskform.preview'));
    expect(getByText('Hazard 1 description')).toBeTruthy();
    expect(queryByText('Hazard 2 description')).toBeNull();
  });
  
  it('renders preview button when form is not submitted', () => {
    const { getByText } = setup({ submitted: false });
  
    expect(getByText('filledriskform.preview')).toBeTruthy();
  });  

  it('renders project name when form is submitted', () => {
    const { getByText } = setup({
      submitted: true,
      survey: { project_name: 'Test Project' },
    });
  
    expect(getByText('filledriskform.project: Test Project')).toBeTruthy();
  });
  
  it('renders formatted date when form is submitted', () => {
    const { getByText } = setup({
      submitted: true,
      formattedDate: { date: '2024-11-15', time: '10:30' },
    });
  
    expect(getByText('2024-11-15')).toBeTruthy();
  });
  
  it('opens modal when preview button is pressed', () => {
    const { getByText, getByTestId } = setup({
      submitted: false,
    });
  
    fireEvent.press(getByText('filledriskform.preview'));
    expect(getByTestId('modal')).toBeTruthy();
  });

  it('renders relevant hazard descriptions when present', () => {
    const formData = {
      hazard1: { status: 'checked', description: 'Hazard 1 description', images: [] },
    };
    const { getByText } = setup({ formData });
  
    fireEvent.press(getByText('filledriskform.preview'));
    expect(getByText('Hazard 1 description')).toBeTruthy();
  });
  
  it('renders empty form message when no relevant hazard descriptions', () => {
    const formData = {};
    const { getByText } = setup({ formData });
  
    fireEvent.press(getByText('filledriskform.preview'));
    expect(getByText('filledriskform.norisks')).toBeTruthy();
  });
  
  it('renders hazard images when available', () => {
    const formData = {
      hazard1: { status: 'checked', description: 'Hazard with image', images: [{ blobName: 'image1.jpg' }] },
    };
    const { getByText, getByTestId } = setup({ formData });
  
    fireEvent.press(getByText('filledriskform.preview'));
    expect(getByText('Hazard with image')).toBeTruthy();
    expect(getByTestId('risk-image-0')).toBeTruthy();
  });
  
  it('closes modal when close button is pressed', () => {
    const { queryByTestId, getByText } = setup({ submitted: true });
  
    fireEvent.press(getByText('filledriskform.project:'));
    fireEvent.press(getByText('closebutton.close'));
    expect(queryByTestId('modal')).toBeNull();
  });
  
  it('closes modal and calls handleSubmit when submit is pressed', () => {
    const handleSubmit = jest.fn();
    const { getByText, queryByTestId } = setup({ submitted: false, handleSubmit });

    fireEvent.press(getByText('filledriskform.preview'));
  
    fireEvent.press(getByText('riskform.submit'));
    expect(queryByTestId('modal')).toBeNull();
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('closes modal when requesClose is called', async () => {
    const { queryByTestId, getByText, getByTestId } = setup({ submitted: false });
  
    fireEvent.press(getByText('filledriskform.preview'));
    fireEvent(getByTestId('modal'), 'requestClose');
    await waitFor(() => {
      expect(queryByTestId('modal')).toBeNull();
    });
  });
  
  it('does not fetch images if the modal is not visible', async () => {
    const mockRetrieveImage = retrieveImage.mockResolvedValueOnce('http://image1.jpg');
  
    setup({
      formData: {
        hazard1: {
          status: 'checked',
          description: 'Hazard description',
          images: [{ blobName: 'image1.jpg' }],
        },
      },
    });
  
    await waitFor(() => {
      expect(mockRetrieveImage).not.toHaveBeenCalled();
    });
  });
});
