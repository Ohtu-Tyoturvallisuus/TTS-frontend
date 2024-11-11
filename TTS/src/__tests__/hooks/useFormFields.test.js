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
        status: '',
        risk_type: `${key}.risk_type`,
        images: [],
      });
    });
  });

  it('should update form fields when language changes to Finnish', async () => {
    useTranslation.mockReturnValue({
      t: (key) => key,
      i18n: { language: 'en-GB' },
    });

    const { result, rerender } = renderHook(() => useFormFields());

    act(() => {
      useTranslation.mockReturnValueOnce({
        t: (key) => key,
        i18n: { language: 'fi-FI' },
      });
      rerender();
    });

    Object.keys(fiFormFields).forEach((key) => {
      expect(result.current.initialFormData).toHaveProperty(key);
      expect(result.current.initialFormData[key]).toEqual({
        description: '',
        status: '',
        risk_type: `${key}.risk_type`,
        images: [],
      });
    });
  });

  it('should contain the correct initial form data structure', () => {
    const mockTranslationFunction = jest.fn().mockImplementation((key) => key);
    useTranslation.mockReturnValue({
      t: mockTranslationFunction,
      i18n: { language: 'en-GB' },
    });

    const { result } = renderHook(() => useFormFields());

    Object.keys(enFormFields).forEach((key) => {
      expect(result.current.initialFormData[key]).toEqual({
        description: '',
        status: '',
        risk_type: mockTranslationFunction(`${key}.risk_type`, { ns: 'formFields' }),
        images: [],
      });
    });
  });
});
