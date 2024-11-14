import { performTranslations } from '../../services/performTranslations';
import { translateText } from '@services/apiService';

jest.mock('@services/apiService');

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      local_ip: '192.168.1.1',
      local_setup: 'true',
    },
  },
}));

describe('performTranslations', () => {
  it('should return an error when no languages are selected for translation', async () => {
    const result = await performTranslations('Hello', 'en', []);
    expect(result).toEqual({
      translations: {},
      error: 'No languages selected for translation',
    });
  });

  it('should return translations when translateText resolves successfully', async () => {
    const mockTranslations = { es: 'Hola', fr: 'Bonjour' };
    translateText.mockResolvedValue(mockTranslations);

    const result = await performTranslations('Hello', 'en', ['es', 'fr']);
    expect(result).toEqual({
      translations: mockTranslations,
      error: null,
    });
  });

  it('should return an error when translateText throws an error', async () => {
    translateText.mockRejectedValue(new Error('Translation error'));

    const result = await performTranslations('Hello', 'en', ['es', 'fr']);
    expect(result).toEqual({
      translations: {},
      error: 'Error translating text',
    });
  });
});
