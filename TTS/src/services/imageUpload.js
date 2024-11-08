import { postImages } from '@services/apiService';

export const uploadImages = async (images, title) => {
  if (images.length === 0) {
    console.log('Attempted to upload without image');
    return [];
  }

  const imageData = new FormData();
  images.forEach((image, index) => {
    imageData.append(`image${index + 1}`, {
      uri: image.uri,
      name: `${title}_photo${index + 1}.jpg`,
      type: 'image/jpeg',
    });
  });
  console.log('Uploading images:', imageData);
  try {
    const response = await postImages(imageData);
    console.log(`Images for ${title} uploaded successfully`);
    const blobNames = response.urls.map(url => {
      const parts = url.split('/');
      return parts[parts.length - 1];
    });
    console.log('Blob names:', blobNames);
    console.log('---------------------------------');
    return blobNames;
  } catch (error) {
    console.error('Error uploading images:', error);
    return [];
  }
};