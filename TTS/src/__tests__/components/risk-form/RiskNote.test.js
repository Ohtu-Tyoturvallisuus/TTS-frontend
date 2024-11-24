import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RiskNote from '@components/risk-form/RiskNote';
import { FormProvider } from '@contexts/FormContext';
import { performTranslations } from '@services/performTranslations';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'risknote.checked': 'Kunnossa',
        'risknote.notRelevant': 'Ei koske',
        'risknote.toBeNoted': 'Huomioitavaa',
        'risknote.undo': 'Kumoa',
        'risknote.preview': 'Esikatsele',
        'riskmodal.extraInfo': 'Syötä lisätietoja',
        'riskmodal.withSpeech': 'Syötä puheella',
        'riskmodal.cancel': 'Peruuta',
        'riskmodal.reset': 'Tyhjennä',
        'riskmodal.checked': 'Kunnossa',
        'riskmodal.edit': 'Muokkaa',
        'riskmodal.translatePreview': 'Käännä (esikatselu)',
        'takepicture.selectFromGallery': 'Valitse galleriasta',
        'takepicture.takePicture': 'Ota kuva',
        'takepicture.noPictures': 'Ei kuvia',
        'riskform.title': 'Vaarojen tunnistuslomake'
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

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('@contexts/TranslationContext', () => ({
    useTranslationLanguages: jest.fn(() => ({

    fromLang: 'fi',

     toLangs: ['en', 'sv'],

    })),

  toLangs: ['en', 'sv'],
}));

jest.mock('@services/performTranslations', () => ({
  performTranslations: jest.fn(() => Promise.resolve({ translations: { en: 'Test Translation' }, error: null })),
}));

const Wrapper = ({ children }) => {
  return (
    <FormProvider>
      {children}
    </FormProvider>
  );
};

describe('RiskNote Component', () => {
  const title = 'Test Risk Note';

  const renderTitle = (key) => {
    return `Translated: ${key}`; // Mocking the renderTitle function
  };

  it('displays the risk note and buttons', () => {
    const { getByText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
    
    expect(getByText('Translated: Test Risk Note')).toBeTruthy();
    expect(getByText('Huomioitavaa')).toBeTruthy();
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('renders the title when renderTitle is not provided', () => {
    const { getByText } = render(
      <Wrapper>
        <RiskNote title={title} />
      </Wrapper>
    );
    
    expect(getByText('Test Risk Note')).toBeTruthy();
  });

  it('should submit new description and status as "Kunnossa"', async() => {
    const { getByText, getByPlaceholderText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
    
    fireEvent.press(getByText('Huomioitavaa'));
    const descriptionInput = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(descriptionInput, 'Lisätietoja');
    fireEvent.press(getByText('Käännä (esikatselu)'));

    await waitFor(() => {
      expect(getByText('Kunnossa')).toBeTruthy();
    });
    fireEvent.press(getByText('Kunnossa'));
  });

  it('should open preview modal when "Esikatsele" is pressed', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
    
    fireEvent.press(getByText('Huomioitavaa'));
    const descriptionInput = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(descriptionInput, 'Lisätietoja');
    fireEvent.press(getByText('Käännä (esikatselu)'));

    await waitFor(() => {
      expect(getByText('Kunnossa')).toBeTruthy();
    });

    fireEvent.press(getByText('Kunnossa'));
    expect(getByText('Esikatsele')).toBeTruthy();
    fireEvent.press(getByText('Esikatsele'));
  });

  it('should open edit modal when "Muokkaa" is pressed', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
    
    fireEvent.press(getByText('Huomioitavaa'));
    const descriptionInput = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(descriptionInput, 'Lisätietoja');
    fireEvent.press(getByText('Käännä (esikatselu)'));

    await waitFor(() => {
      expect(getByText('Kunnossa')).toBeTruthy();
      expect(getByText('Muokkaa')).toBeTruthy();
    });

    fireEvent.press(getByText('Muokkaa'));

    await waitFor(() => {
      expect(getByText('Käännä (esikatselu)')).toBeTruthy();
    });
  });

  it('displays "Ei koske" message when "Ei koske" is pressed', () => {
    const { getByText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
    
    fireEvent.press(getByText('Ei koske'));
    expect(getByText('Ei koske')).toBeTruthy();
  });

  it('should undo "Ei Koske" selection when "Kumoa" is pressed', () => {
    const { getByText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
    
    fireEvent.press(getByText('Ei koske'));
    fireEvent.press(getByText('Kumoa'));
    expect(getByText('Huomioitavaa')).toBeTruthy();
  });

  it('should close edit modal when "Peruuta" is pressed', () => {
    const { getByText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
    
    fireEvent.press(getByText('Huomioitavaa'));
    fireEvent.press(getByText('Peruuta'));
    expect(getByText('Ei koske')).toBeTruthy();
    expect(getByText('Huomioitavaa')).toBeTruthy();
  });

  it('should close preview modal when "Muokkaa" is pressed', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );

    fireEvent.press(getByText('Huomioitavaa'));
    const descriptionInput = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(descriptionInput, 'Lisätietoja');
    fireEvent.press(getByText('Käännä (esikatselu)'));

    // Wait for the translation to complete
    await waitFor(() => {
      expect(performTranslations).toHaveBeenCalled();
    });

    fireEvent.press(getByText('Muokkaa'));

    // Wait for the modal to close
    await waitFor(() => {
      expect(getByText('Käännä (esikatselu)')).toBeTruthy();
    });
  });

  it('handles onRequestClose for preview modal', async () => {
    const { getByText, getByTestId, getByPlaceholderText, queryByText } = render(
      <Wrapper>
        <RiskNote
          title={title}
          renderTitle={renderTitle}
        />
      </Wrapper>
    );
  
    fireEvent.press(getByText('Huomioitavaa'));
    const descriptionInput = getByPlaceholderText('Syötä lisätietoja');
    fireEvent.changeText(descriptionInput, 'Lisätietoja');
    fireEvent.press(getByText('Käännä (esikatselu)'));

    await waitFor(() => {
      expect(queryByText('Muokkaa')).toBeTruthy();
      expect(queryByText('Kunnossa')).toBeTruthy();
    });
  
    fireEvent(getByTestId('custom-modal'), 'requestClose');
    await waitFor(() => {
      expect(queryByText('Muokkaa')).toBeNull();
      expect(queryByText('Kunnossa')).toBeNull();
    });
  });
});
