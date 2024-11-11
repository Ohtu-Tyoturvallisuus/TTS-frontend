import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TakePictureView from '@components/take-picture/TakePictureView';
import * as ImagePicker from 'expo-image-picker';
import { useFormContext } from '@contexts/FormContext';

jest.spyOn(ImagePicker, 'requestCameraPermissionsAsync').mockResolvedValue({
  status: 'granted',
});
jest.spyOn(ImagePicker, 'requestMediaLibraryPermissionsAsync').mockResolvedValue({
  status: 'granted',
});

jest.mock('@contexts/FormContext', () => ({
  useFormContext: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('TakePictureView', () => {
  const mockGetFormData = jest.fn();
  const mockUpdateFormField = jest.fn();

  beforeEach(() => {
    useFormContext.mockReturnValue({
      getFormData: mockGetFormData,
      updateFormField: mockUpdateFormField,
    });
    mockGetFormData.mockReturnValue([]);
    jest.clearAllMocks();
  });

  it('renders initial state without images', () => {
    const { getByText } = render(<TakePictureView title="test-title" />);
    expect(getByText('takepicture.noPictures')).toBeTruthy();
  });

  it('calls pickImage function with correct source when buttons are pressed', async () => {
    const mockLaunchImageLibraryAsync = jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri-1' }],
    });
    const mockLaunchCameraAsync = jest.spyOn(ImagePicker, 'launchCameraAsync').mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri-2' }],
    });

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.selectFromGallery'));
    await waitFor(() => expect(mockLaunchImageLibraryAsync).toHaveBeenCalled());

    fireEvent.press(getByText('takepicture.takePicture'));
    await waitFor(() => expect(mockLaunchCameraAsync).toHaveBeenCalled());
  });

  it('removes an image when remove button is pressed', async () => {
    mockGetFormData.mockReturnValue([{ uri: 'mock-uri', isLandscape: true }]);

    const { getByText, queryByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('X'));

    await waitFor(() => expect(mockUpdateFormField).toHaveBeenCalledWith('test-title', 'images', []));
    expect(queryByText('mock-uri')).toBeNull();
  });

  it('shows a message if permissions are denied', async () => {
    const mockRequestCameraPermissions = jest.spyOn(ImagePicker, 'requestCameraPermissionsAsync').mockResolvedValueOnce({
      status: 'denied',
    });

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.takePicture'));
    await waitFor(() => expect(mockRequestCameraPermissions).toHaveBeenCalled());

    mockRequestCameraPermissions.mockRestore();
  });

  it('does not add an image if image picking is canceled', async () => {
    jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValueOnce({
      canceled: true,
      assets: [],
    });
  
    const { getByText } = render(<TakePictureView title="test-title" />);
  
    fireEvent.press(getByText('takepicture.selectFromGallery'));
  
    await waitFor(() => expect(mockUpdateFormField).not.toHaveBeenCalled());
  });

  it('prompts for permissions if undetermined', async () => {
    jest.spyOn(ImagePicker, 'requestMediaLibraryPermissionsAsync').mockResolvedValueOnce({
      status: 'undetermined',
    });
  
    const { getByText } = render(<TakePictureView title="test-title" />);
  
    fireEvent.press(getByText('takepicture.selectFromGallery'));
  
    await waitFor(() => expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled());
  });
});

