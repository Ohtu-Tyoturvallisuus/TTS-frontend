import { uploadImages } from '@services/imageUpload';
import { postImages } from '@services/apiService';

jest.mock('expo-constants', () => ({
  expoConfig: { "192.168.1.1": "",
    extra: {
      local_ip: '127.0.0.1',
      local_setup: 'true'
    }
  }
}));

jest.mock('@services/apiService');

describe('uploadImages', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns an empty array when no images are provided', async () => {
    const result = await uploadImages([], 'testTitle');
    expect(result).toEqual([]);
  });

  test('uploads images successfully and returns blob names', async () => {
    const mockImages = [
      { uri: 'image1.jpg' },
      { uri: 'image2.jpg' },
    ];
    const mockResponse = {
      urls: [
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg',
      ],
    };
    postImages.mockResolvedValueOnce(mockResponse);

    const result = await uploadImages(mockImages, 'testTitle');

    expect(postImages).toHaveBeenCalledWith(expect.any(FormData));
    expect(result).toEqual(['image1.jpg', 'image2.jpg']);
  });

  test('returns an empty array and logs an error when image upload fails', async () => {
    const mockImages = [
      { uri: 'image1.jpg' },
      { uri: 'image2.jpg' },
    ];
    const mockError = new Error('Upload failed');
    postImages.mockRejectedValueOnce(mockError);

    const result = await uploadImages(mockImages, 'testTitle');

    expect(postImages).toHaveBeenCalledWith(expect.any(FormData));
    expect(result).toEqual([]);
  });
});