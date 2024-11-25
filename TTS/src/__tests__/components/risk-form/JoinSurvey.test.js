import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useFormik } from 'formik';
import JoinSurvey from '@components/risk-form/JoinSurvey';
import { getSurveyByAccessCode } from '@services/apiService';
import { UserContext } from '@contexts/UserContext';

jest.mock('@services/apiService', () => ({
  getSurveyByAccessCode: jest.fn(),
}));

jest.mock('formik', () => {
  const actualFormik = jest.requireActual('formik');
  return {
    ...actualFormik,
    useFormik: jest.fn(),
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn((key) => key),
  }),
}));

describe('JoinSurvey Component', () => {
  let setJoinedSurveyMock;
  const mockFormik = jest.requireActual('formik').useFormik;

  beforeEach(() => {
    setJoinedSurveyMock = jest.fn();
    useFormik.mockImplementation(mockFormik);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <UserContext.Provider
        value={{ joinedSurvey: false, setJoinedSurvey: setJoinedSurveyMock }}
      >
        <JoinSurvey />
      </UserContext.Provider>
    );

  it('renders the join button correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('joinsurvey.join')).toBeTruthy();
  });

  it('opens the modal when the join button is pressed', () => {
    const { getByText, queryByText } = renderComponent();
    fireEvent.press(getByText('joinsurvey.join'));
    expect(queryByText('joinsurvey.insertCode')).toBeTruthy();
  });

  it('displays validation error for invalid access code', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderComponent();
    fireEvent.press(getByTestId('outsideModalButtonText'));

    const input = getByPlaceholderText('joinsurvey.insertPlaceholder');
    fireEvent.changeText(input, '123');
    fireEvent.press(getByTestId('insideModalButtonText'));

    await waitFor(() => {
      expect(getByText('joinsurvey.error_length')).toBeTruthy();
    });
  });

  it('calls the API and updates the context on successful join', async () => {
    const surveyMock = {
      risk_notes: [],
      project_name: 'Test Project',
      project_id: 1,
      description: 'Test description',
      scaffold_type: 'Type A',
      task: 'Task A',
    };

    getSurveyByAccessCode.mockResolvedValue(surveyMock);

    const { getByPlaceholderText, getByTestId } = renderComponent();
    fireEvent.press(getByTestId('outsideModalButtonText'));

    const input = getByPlaceholderText('joinsurvey.insertPlaceholder');
    fireEvent.changeText(input, '123456');
    fireEvent.press(getByTestId('insideModalButtonText'));

    await waitFor(() => {
      expect(setJoinedSurveyMock).toHaveBeenCalledWith(true);
      expect(getSurveyByAccessCode).toHaveBeenCalledWith('123456');
    });
  });

  it('displays an error message when the API call fails', async () => {
    getSurveyByAccessCode.mockRejectedValue(new Error('API Error'));

    const { getByText, getByPlaceholderText, getByTestId } = renderComponent();
    fireEvent.press(getByTestId('outsideModalButtonText'));

    const input = getByPlaceholderText('joinsurvey.insertPlaceholder');
    fireEvent.changeText(input, '123456');
    fireEvent.press(getByTestId('insideModalButtonText'));

    await waitFor(() => {
      expect(getByText('joinsurvey.fetchError')).toBeTruthy();
    });
  });

  it('closes the modal on CloseButton press', () => {
    const { getByText, queryByText } = renderComponent();
    fireEvent.press(getByText('joinsurvey.join'));

    const closeButton = getByText('closebutton.close');
    fireEvent.press(closeButton);

    expect(queryByText('joinsurvey.insertCode')).toBeFalsy();
  });

  it('handles modal close using onRequestClose', () => {
    const { getByText, queryByText, getByTestId } = renderComponent();

    const joinButton = getByTestId('outsideModalButtonText');
    fireEvent.press(joinButton);

    expect(getByText('joinsurvey.insertCode')).toBeTruthy();

    const modalCloseRequest = queryByText('joinsurvey.insertCode').parent.parent;
    fireEvent(modalCloseRequest, 'onRequestClose');

    expect(queryByText('joinsurvey.insertCode')).toBeNull();
  });
});