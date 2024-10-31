export const Audio = {
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    setAudioModeAsync: jest.fn(),
    Recording: jest.fn(() => {
      return {
        prepareToRecordAsync: jest.fn(),
        startAsync: jest.fn(),
        stopAndUnloadAsync: jest.fn(),
        getURI: jest.fn(() => 'mock-uri'),
      };
    }),
  }