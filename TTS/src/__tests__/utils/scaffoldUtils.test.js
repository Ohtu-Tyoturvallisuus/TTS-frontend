import { renderHook } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { useScaffoldItems } from '@utils/scaffoldUtils';
import scaffoldings from '@constants/scaffoldTypes.json';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('useScaffoldItems', () => {
  const mockTranslation = {
    'scaffoldTypes.facadeScaffold': 'Facade Scaffold',
    'scaffoldTypes.weatherScaffold': 'Weather Scaffold',
    'scaffoldTypes.accessessScaffold': 'Access Scaffold',
    'scaffoldTypes.birdcageScaffold': 'Birdcage Scaffold',
    'scaffoldTypes.tankScaffold': 'Tank Scaffold',
    'scaffoldTypes.liftingScaffold': 'Lifting Scaffold',
    'scaffoldTypes.suspendedScaffold': 'Suspended Scaffold',
    'scaffoldTypes.shoringScaffold': 'Shoring Scaffold',
    'scaffoldTypes.workScaffold': 'Work Scaffold',
    'scaffoldTypes.weatherproof': 'Weatherproof',
    'scaffoldTypes.nonWeatherproof': 'Non-Weatherproof',
  };

  beforeEach(() => {
    useTranslation.mockReturnValue({
      t: (key) => mockTranslation[key] || key,
    });
  });

  it('should return scaffold items with translated names and IDs', () => {
    const { result } = renderHook(() => useScaffoldItems());

    const expected = scaffoldings.scaffoldTypes.map((key) => ({
      id: key,
      name: mockTranslation[`scaffoldTypes.${key}`],
    }));

    expect(result.current).toEqual(expected);
  });

  it('should handle missing translations gracefully', () => {
    useTranslation.mockReturnValue({
      t: () => undefined, // Simulate missing translations
    });

    const { result } = renderHook(() => useScaffoldItems());

    const expected = scaffoldings.scaffoldTypes.map((key) => ({
      id: key,
      name: undefined, // Expect undefined for missing translations
    }));

    expect(result.current).toEqual(expected);
  });
});
