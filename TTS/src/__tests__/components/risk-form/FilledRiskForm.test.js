import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilledRiskForm from '@components/risk-form/FilledRiskForm';

jest.mock('@components/take-picture/Image', () => {
  const { View } = require('react-native');
  // eslint-disable-next-line react/display-name
  return ({ testID }) => <View testID={testID} />;
});

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
      task: 'task1',
      scaffoldType: 'type1',
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
});
