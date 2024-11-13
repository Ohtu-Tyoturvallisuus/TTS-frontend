describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {    
    jest.resetAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('when LOCAL_SETUP is true', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        EXPO_PUBLIC_LOCAL_SETUP: 'true',
      };
    });

    it('sets API_BASE_URL to local IP', () => {
      const Config = require('@utils/Config').default;
      expect(Config.apiUrl).toBe('http://192.168.1.1:8000/api/');
    });
  });

  describe('when LOCAL_SETUP is false', () => {
    it('sets API_BASE_URL to UAT when ENVIRONMENT is uat', () => {
      process.env.EXPO_PUBLIC_ENVIRONMENT = 'uat';
      const Config = require('@utils/Config').default;
      expect(Config.apiUrl).toBe('https://tts-app-uat.azurewebsites.net/api/');
    });

    it('sets API_BASE_URL to production when ENVIRONMENT is production', () => {
      process.env.EXPO_PUBLIC_ENVIRONMENT = 'production';
      const Config = require('@utils/Config').default;
      expect(Config.apiUrl).toBe('https://tts-app-prod.azurewebsites.net/api/');
    });

    it('defaults API_BASE_URL to main environment if ENVIRONMENT is not specified', () => {
      delete process.env.EXPO_PUBLIC_ENVIRONMENT;
      const Config = require('@utils/Config').default;
      expect(Config.apiUrl).toBe('https://tts-app.azurewebsites.net/api/');
    });
  });

  describe('when Updates.channel is set to production or uat', () => {
    it('overrides Config.apiUrl to production URL when Updates.channel is production', () => {
      jest.mock('expo-updates', () => ({
        channel: 'production',
      }));
      const Config = require('@utils/Config').default;
      expect(Config.apiUrl).toBe('https://tts-app-prod.azurewebsites.net/api/');
    });

    it('overrides Config.apiUrl to UAT URL when Updates.channel is uat', () => {
      jest.mock('expo-updates', () => ({
        channel: 'uat',
      }));
      const Config = require('@utils/Config').default;
      expect(Config.apiUrl).toBe('https://tts-app-uat.azurewebsites.net/api/');
    });

    it('does not override Config.apiUrl when Updates.channel is neither uat nor production', () => {
      jest.mock('expo-updates', () => ({
        channel: 'development',
      }));
      process.env = {
        ...originalEnv,
        EXPO_PUBLIC_ENVIRONMENT: 'main',
      };
      const Config = require('@utils/Config').default;
      expect(Config.apiUrl).toBe('https://tts-app.azurewebsites.net/api/');
    });
  });
});
