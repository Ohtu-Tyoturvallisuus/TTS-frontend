import { renderHook, act } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import useFormFields from '@hooks/useFormFields';
import enFormFields from '@lang/locales/en/formFields.json';
import fiFormFields from '@lang/locales/fi/formFields.json';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('useFormFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with English form fields by default', () => {
    useTranslation.mockReturnValue({
      t: (key) => key,
      i18n: { language: 'en-GB' },
    });

    const { result } = renderHook(() => useFormFields());

    Object.keys(enFormFields).forEach((key) => {
      expect(result.current.initialFormData).toHaveProperty(key);
      expect(result.current.initialFormData[key]).toEqual({
        description: '',
        translations: {},
        risk_type: `${key}.risk_type`,
        images: [],
      });
    });
  });

  it('should update form fields when language changes to Finnish', () => {
    const changeLanguageMock = jest.fn();
    useTranslation.mockReturnValue({
      t: (key) => key,
      i18n: {
        language: 'en-GB',
        changeLanguage: changeLanguageMock,
      },
    });

    const { result, rerender } = renderHook(() => useFormFields());

    act(() => {
      changeLanguageMock('fi-FI');
    });

    useTranslation.mockReturnValue({
      t: (key) => key,
      i18n: {
        language: 'fi-FI',
        changeLanguage: changeLanguageMock,
      },
    });

    rerender();

    Object.keys(fiFormFields).forEach((key) => {
      expect(result.current.initialFormData).toHaveProperty(key);
      expect(result.current.initialFormData[key]).toEqual({
        description: '',
        translations: {},
        risk_type: `${key}.risk_type`,
        images: [],
      });
    });
  });

  it('should contain the correct initial form data structure', () => {
    useTranslation.mockReturnValue({
      t: (key) => key,
      i18n: { language: 'en-GB' },
    });

    const { result } = renderHook(() => useFormFields());

    Object.keys(enFormFields).forEach((key) => {
      expect(result.current.initialFormData[key]).toEqual({
        description: '',
        translations: {},
        risk_type: `${key}.risk_type`,
        images: [],
      });
    });
  });
});
