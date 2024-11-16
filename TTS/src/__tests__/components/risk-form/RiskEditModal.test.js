import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RiskEditModal from '@components/risk-form/RiskEditModal';
import { FormProvider } from '@contexts/FormContext';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'riskmodal.extraInfo': 'Syötä lisätietoja',
        'riskmodal.withSpeech': 'Syötä puheella',
        'riskmodal.cancel': 'Peruuta',
        'riskmodal.reset': 'Resetoi',
        'riskmodal.checked': 'Kunnossa',
        'riskmodal.edit': 'Muokkaa',
        'riskmodal.translatePreview': 'Käännä (esikatselu)',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'fi-FI',
    },
  }),
}));

jest.mock('@hooks/useFormFields', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    initialFormData: {
      personal_protection: { description: '', status: '', risk_type: 'scaffolding' },
      personal_fall_protection: { description: '', status: '', risk_type: 'scaffolding' },
    },
  })),
}));

jest.mock('@components/CustomModal', () => {
  const CustomModalMock = ({ children, visible }) => (
    <>{visible && <>{children}</>}</>
  );
  CustomModalMock.displayName = 'CustomModalMock';
  return CustomModalMock;
});

jest.mock('@components/speech-to-text/SpeechToTextView', () => {
  const { Text, TouchableOpacity } = require('react-native');
  const SpeechToTextViewMock = ({ setDescription }) => (
    <TouchableOpacity onPress={() => setDescription('Speech input')}>
      <Text>Speech to Text Component</Text>
    </TouchableOpacity>
  );
  SpeechToTextViewMock.displayName = 'SpeechToTextViewMock';
  return SpeechToTextViewMock;
});

jest.mock('@components/take-picture/TakePictureView', () => {
  const { Text } = require('react-native');
  const TakePictureViewMock = () => <Text>Take Picture Component</Text>;
  TakePictureViewMock.displayName = 'TakePictureViewMock';
  return TakePictureViewMock;
});

const Wrapper = ({ children }) => {
  return (
    <FormProvider>
      {children}
    </FormProvider>
  );
};

describe('RiskEditModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnTranslate = jest.fn();
  const mockOnReset = jest.fn();
  const title = 'Test Title';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders title using renderTitle function', () => {
    const customRenderTitle = jest.fn((title) => `Rendered: ${title}`);

    const { getByText } = render(
      <Wrapper>
        <RiskEditModal 
          title={title}
          renderTitle={customRenderTitle}
          visible={true}
          onTranslate={mockOnTranslate}
          onReset={mockOnReset}
          onClose={mockOnClose}
        />
      </Wrapper>
    );

    expect(getByText('Rendered: Test Title')).toBeTruthy();
    expect(customRenderTitle).toHaveBeenCalledWith(title);
  });

  it('renders title directly when renderTitle is not provided', () => {
    const { getByText } = render(
      <Wrapper>
        <RiskEditModal 
          title={title}
          visible={true}
          onTranslate={mockOnTranslate}
          onReset={mockOnReset}
          onClose={mockOnClose}
        />
      </Wrapper>
    );

    expect(getByText(title)).toBeTruthy();
  });

  it('initializes description from form context', () => {
    const { getByPlaceholderText } = render(
      <Wrapper>
        <RiskEditModal 
          title={title}
          visible={true}
          onTranslate={mockOnTranslate}
          onReset={mockOnReset}
          onClose={mockOnClose}
        />
      </Wrapper>
    );

    const input = getByPlaceholderText('Syötä lisätietoja');
    expect(input.props.value).toBe('');
  });

  it('submits the form and updates form field', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Wrapper>
        <RiskEditModal 
          title={title}
          visible={true}
          onTranslate={mockOnTranslate}
          onReset={mockOnReset}
          onClose={mockOnClose}
        />
      </Wrapper>
    );

    const input = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(input, 'Test Description');

    fireEvent.press(getByText('Käännä (esikatselu)'));

    await waitFor(() => {
      expect(mockOnTranslate).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('resets the description on reset button click', async () => {
    const { getByText } = render(
      <Wrapper>
        <RiskEditModal 
          title={title}
          visible={true}
          onTranslate={mockOnTranslate}
          onReset={mockOnReset}
          onClose={mockOnClose}
        />
      </Wrapper>
    );

    fireEvent.press(getByText('Resetoi'));

    await waitFor(() => {
      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  it('disables submit button when description is empty', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Wrapper>
        <RiskEditModal 
          title={title}
          visible={true}
          onTranslate={mockOnTranslate}
          onReset={mockOnReset}
          onClose={mockOnClose}
        />
      </Wrapper>
    );

    const submitButton = getByTestId('submit-button');

    expect(submitButton.props.style).toEqual(
      expect.objectContaining({ backgroundColor: 'lightgray' })
    );

    const input = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(input, 'Test Description');

    expect(submitButton.props.style).not.toEqual(
      expect.objectContaining({ backgroundColor: 'lightgray' })
    );
  });  
});
