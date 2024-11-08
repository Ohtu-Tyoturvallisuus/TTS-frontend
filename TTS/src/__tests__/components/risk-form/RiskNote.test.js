import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RiskNote from '@components/risk-form/RiskNote';
import { FormProvider } from '@contexts/FormContext';

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
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'fi-FI',
    },
  }),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      local_ip: '192.168.1.1',
      local_setup: 'true',
    },
  },
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

  it('should submit new description and status as "Kunnossa"', () => {
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

    expect(getByText('Kunnossa')).toBeTruthy();
    fireEvent.press(getByText('Kunnossa'));
  });

  it('should open preview modal when "Esikatsele" is pressed', () => {
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

    expect(getByText('Kunnossa')).toBeTruthy();
    fireEvent.press(getByText('Kunnossa'));
    expect(getByText('Esikatsele')).toBeTruthy();
    fireEvent.press(getByText('Esikatsele'));
  });

  it('should open edit modal when "Muokkaa" is pressed', () => {
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

    expect(getByText('Kunnossa')).toBeTruthy();
    expect(getByText('Muokkaa')).toBeTruthy();
    fireEvent.press(getByText('Muokkaa'));
    expect(getByText('Käännä (esikatselu)')).toBeTruthy();
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

  it('should close preview modal when "Muokkaa" is pressed', () => {
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
    fireEvent.press(getByText('Muokkaa'));
    expect(getByText('Käännä (esikatselu)')).toBeTruthy();
  });
});
