import { renderHook } from '@testing-library/react-native';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useScaffoldItems } from '@utils/scaffoldUtils';

jest.mock('i18next', () => ({
  getResourceBundle: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('useScaffoldItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct scaffold items based on translation keys', () => {
    i18next.getResourceBundle.mockReturnValue({
      scaffoldTypes: {
        facadeScaffold: 'Facade scaffolding',
        weatherScaffold: 'Weather protection',
      },
    });

    useTranslation.mockReturnValue({
      t: jest.fn((key) => {
        const translations = {
          'scaffoldTypes.facadeScaffold': 'Facade scaffolding',
          'scaffoldTypes.weatherScaffold': 'Weather protection',
        };
        return translations[key] || key;
      }),
    });

    const { result } = renderHook(() => useScaffoldItems());

    expect(result.current).toEqual([
      { id: 'facadeScaffold', name: 'Facade scaffolding' },
      { id: 'weatherScaffold', name: 'Weather protection' },
    ]);

    expect(i18next.getResourceBundle).toHaveBeenCalledWith('en', 'translation');
    expect(useTranslation().t).toHaveBeenCalledWith('scaffoldTypes.facadeScaffold');
    expect(useTranslation().t).toHaveBeenCalledWith('scaffoldTypes.weatherScaffold');
  });

  it('returns an empty array if no scaffoldTypes exist in the resource bundle', () => {
    i18next.getResourceBundle.mockReturnValue({});
  
    useTranslation.mockReturnValue({
      t: jest.fn((key) => key),
    });
  
    const { result } = renderHook(() => useScaffoldItems());
  
    expect(result.current).toEqual([]);
    expect(i18next.getResourceBundle).toHaveBeenCalledWith('en', 'translation');
  });

  it('returns an empty array when scaffoldBundle is null', () => {
    i18next.getResourceBundle.mockReturnValue(null);

    useTranslation.mockReturnValue({
      t: jest.fn((key) => key),
    });

    const { result } = renderHook(() => useScaffoldItems());

    expect(result.current).toEqual([]);

    expect(i18next.getResourceBundle).toHaveBeenCalledWith('en', 'translation');
  });  

  it('handles missing translation keys gracefully', () => {
    i18next.getResourceBundle.mockReturnValue({
      scaffoldTypes: {
        facadeScaffold: 'Facade scaffolding',
        missingTranslation: undefined,
      },
    });

    useTranslation.mockReturnValue({
      t: jest.fn((key) => {
        const translations = {
          'scaffoldTypes.facadeScaffold': 'Facade scaffolding',
        };
        return translations[key] || `Missing: ${key}`;
      }),
    });

    const { result } = renderHook(() => useScaffoldItems());

    expect(result.current).toEqual([
      { id: 'facadeScaffold', name: 'Facade scaffolding' },
      { id: 'missingTranslation', name: 'Missing: scaffoldTypes.missingTranslation' },
    ]);
  });
});
