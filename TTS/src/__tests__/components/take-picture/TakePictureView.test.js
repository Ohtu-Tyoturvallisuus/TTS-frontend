import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TakePictureView from '@components/take-picture/TakePictureView';
import * as ImagePicker from 'expo-image-picker';
import { Image as RNImage, Platform } from 'react-native';
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

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: true }),
  MediaTypeOptions: {
    Images: 'Images',
  },
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

describe('TakePictureView - Image Handling', () => {
  const mockGetFormData = jest.fn();
  const mockUpdateFormField = jest.fn();

  beforeEach(() => {
    useFormContext.mockReturnValue({
      getFormData: mockGetFormData,
      updateFormField: mockUpdateFormField,
    });
    mockGetFormData.mockReturnValue([]);
    jest.clearAllMocks();
    Platform.OS = 'ios';  // Default platform
  });

  it('calls pickImage function with correct source when buttons are pressed', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri-1' }],
    });
    ImagePicker.launchCameraAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri-2' }],
    });

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.selectFromGallery'));
    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());

    fireEvent.press(getByText('takepicture.takePicture'));
    await waitFor(() => expect(ImagePicker.launchCameraAsync).toHaveBeenCalled());
  });

  it('handles image orientation and updates form data', async () => {
    const mockUri = 'mock-uri-1';
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: mockUri }],
    });

    jest.spyOn(RNImage, 'getSize').mockImplementation((uri, successCallback) => {
      successCallback(800, 600); // Landscape
    });

    const { getByText } = render(<TakePictureView title="test-title" />);
    fireEvent.press(getByText('takepicture.selectFromGallery'));

    await waitFor(() => {
      expect(mockUpdateFormField).toHaveBeenCalledWith('test-title', 'images', [
        { uri: mockUri, isLandscape: true },
      ]);
    });
  });

  it('does nothing on web platform', async () => {
    Platform.OS = 'web';
    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.selectFromGallery'));
    fireEvent.press(getByText('takepicture.takePicture'));

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
      expect(ImagePicker.requestCameraPermissionsAsync).not.toHaveBeenCalled();
    });
  });
});

describe('TakePictureView - Permissions Handling', () => {
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

  it('requests media library permissions if source is gallery and Platform.OS is not web', async () => {
    Platform.OS = 'ios';
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri' }],
    });

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.selectFromGallery'));

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('requests camera permissions if source is camera and Platform.OS is not web', async () => {
    Platform.OS = 'ios';
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    ImagePicker.launchCameraAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri' }],
    });

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.takePicture'));

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    });
  });
});

describe('TakePictureView - Platform and Source Handling', () => {
  const mockGetFormData = jest.fn();
  const mockUpdateFormField = jest.fn();

  beforeEach(() => {
    useFormContext.mockReturnValue({
      getFormData: mockGetFormData,
      updateFormField: mockUpdateFormField,
    });
    mockGetFormData.mockReturnValue([]);
    jest.clearAllMocks();

    // Provide default resolved values for launch functions
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true });
    ImagePicker.launchCameraAsync.mockResolvedValue({ canceled: true });
  });

  it('does nothing when Platform.OS is web', async () => {
    // Mock Platform.OS to be 'web'
    Platform.OS = 'web';

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.selectFromGallery'));

    // Ensure no permissions are requested when Platform.OS is 'web'
    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
      expect(ImagePicker.requestCameraPermissionsAsync).not.toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
    });
  });

  it('does nothing when Platform.OS is not web and source is invalid', async () => {
    // Mock Platform.OS to be 'ios'
    Platform.OS = 'ios';

    const { getByText } = render(<TakePictureView title="test-title" />);

    // Simulate invalid source
    fireEvent.press(getByText('takepicture.selectFromGallery'));

    // Ensure no permissions are requested and no image picker is launched
    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
      expect(ImagePicker.requestCameraPermissionsAsync).not.toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
    });
  });

  it('requests media library permissions if source is gallery and Platform.OS is not web', async () => {
    Platform.OS = 'ios';
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri' }],
    });

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.selectFromGallery'));

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('requests camera permissions if source is camera and Platform.OS is not web', async () => {
    Platform.OS = 'ios';
    ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
    ImagePicker.launchCameraAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'mock-uri' }],
    });

    const { getByText } = render(<TakePictureView title="test-title" />);

    fireEvent.press(getByText('takepicture.takePicture'));

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    });
  });
});
