import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import { FormProvider } from '@contexts/FormContext';
import RiskForm from '@components/risk-form/RiskForm';
import { submitForm } from '@services/formSubmission';
import fiFormFields from '@lang/locales/fi/formFields.json';

jest.mock('@hooks/useFetchSurveyData', () => jest.fn(() => ({
  surveyData: {
    task: 'Asennus',
    scaffold_type: 'Työteline',
    description: 'Test Description',
    risk_notes: [
      {
        note: 'personal_protection',
        description: '',
        status: 'notRelevant',
        risk_type: 'scaffolding',
      },
      {
        note: 'personal_fall_protection',
        description: 'Valjaat käytössä',
        status: 'checked',
        risk_type: 'scaffolding',
      },
    ],
  },
  loading: false,
  error: null,
})));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      local_ip: '192.168.1.1',
      local_setup: 'true',
    },
  },
}));

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

const flattenFormFields = (formFields) => {
  const translations = {};
  for (const [key, value] of Object.entries(formFields)) {
    translations[`${key}.title`] = value.title;
    translations[`${key}.risk_type`] = value.risk_type;
  }
  return translations;
};

const mockTranslations = {
  ...flattenFormFields(fiFormFields),
  'riskform.successMessage': 'Riskimuistiinpanot lähetetty onnistuneesti',
  'riskform.close': 'Sulje',
  'riskform.title': 'Työturvallisuuslomake',
  'riskform.errorFetchingData': 'Virhe haettaessa lomakkeen tietoja',
  'riskform.errorSubmitting': 'Lomakkeen lähettäminen epäonnistui',
  'riskform.projectName': 'Projektin nimi',
  'riskform.projectId': 'Projektin ID',
  'riskform.task': 'Tehtävä',
  'riskform.installation': 'Asennus',
  'riskform.modification': 'Muokkaus',
  'riskform.dismantling': 'Purku',
  'riskform.scaffoldType': 'Telinetyyppi',
  'riskform.workScaffold': 'Työteline',
  'riskform.nonWeatherproof': 'Sääsuojaton työteline',
  'riskform.weatherproof': 'Sääsuojattu työteline',
  'riskform.taskDescription': 'Mitä olemme tekemässä? (telineen käyttötarkoitus)',
  'riskform.noProject': 'Projekti ei näy...',
  'riskform.loadingFormData': 'Ladataan lomaketietoja...',
  'riskform.scaffoldRisks': 'Telinetöihin liittyvät vaarat',
  'riskform.environmentRisks': 'Työympäristön vaarat',
  'riskform.submit': 'Lähetä',
  'riskform.otherScaffolding': 'Muu telinetyövaara',
  'riskform.otherEnvironment': 'Muu työympäristövaara',
  'risknote.preview': 'Esikatsele',
  'risknote.notRelevant': 'Ei koske',
  'risknote.undo': 'Kumoa',
  'risknote.checked': 'Kunnossa',
  'speechtotext.recognitionLanguage': 'Puheentunnistuskieli',
  'speechtotext.maxLength': 'Maksimipituus',
  'speechtotext.seconds_one': 'yksi sekunti',
  'speechtotext.seconds_other': '{{count}} sekuntia',
  'speechtotext.start': 'Aloita puheentunnistus',
  'speechtotext.stop': 'Lopeta',
  'closebutton.close': 'Sulje',
  'confirmation.confirmLeave': 'Haluatko varmasti poistua?',
  'confirmation.confirm': 'Vahvista',
  'confirmation.cancel': 'Peruuta',
  'confirmation.changesWillBeLost': 'HUOM! Kaikki muutokset menetetään',
  'filledriskform.preview': 'Esikatsele lomake',
};

jest.mock('react-i18next', () => {
  let language = 'fi-FI';
  return {
    useTranslation: () => ({
      t: (key, options) => {
        let translation = mockTranslations[key] || key;
        if (options && options.count !== undefined) {
          if (options.count === 1) {
            translation = mockTranslations[`${key}_one`] || translation;
          } else {
            translation = mockTranslations[`${key}_other`] || translation;
          }
          translation = translation.replace('{{count}}', options.count);
        }
        return translation;
      },
      i18n: {
        language,
        changeLanguage: (lng) => {
          language = lng;
        },
      },
    }),
  };
});

jest.mock('@hooks/useFormFields', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    initialFormData: {
      personal_protection: { description: '', status: '', risk_type: 'scaffolding' },
      personal_fall_protection: { description: '', status: '', risk_type: 'scaffolding' },
    },
  })),
}));

jest.mock('@services/formSubmission', () => ({
  submitForm: jest.fn(),
}));

jest.mock('@contexts/TranslationContext', () => ({
  useTranslationLanguages: jest.fn(() => ({
    setToLangs: jest.fn(),
  })),
}));

describe('RiskForm Component', () => {
  const mockOnFocusChange = jest.fn();
  const mockProject = { 
    id: 1, 
    project_name: 'Test Project', 
    project_id: '1234' 
  };

  const setup = () => {
    const contextValue = {
      selectedProject: mockProject,
      selectedSurveyURL: 'http://example.com/survey',
      resetProjectAndSurvey: jest.fn(),
    };
  
    return render(
      <NavigationContainer>
        <ProjectSurveyContext.Provider value={contextValue}>
          <FormProvider>
            <RiskForm onFocusChange={mockOnFocusChange} />
          </FormProvider>
        </ProjectSurveyContext.Provider>
      </NavigationContainer>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with project details', () => {
    const { getByText } = setup();

    expect(getByText('Projektin nimi:')).toBeTruthy();
    expect(getByText('Test Project')).toBeTruthy();
    expect(getByText('Projektin ID:')).toBeTruthy();
    expect(getByText('1234')).toBeTruthy();
  });

  it('shows success alert after successful submission', async () => {
    submitForm.mockImplementationOnce((mockProject, taskInfo, formData, setShowSuccessAlert) => {
      setShowSuccessAlert(true);
    });

    const { getByText } = setup();

    fireEvent.press(getByText('Esikatsele lomake'));

    fireEvent.press(getByText('Lähetä'));

    await waitFor(() => {
      expect(getByText('Riskimuistiinpanot lähetetty onnistuneesti')).toBeTruthy();
    });
  });

  it('shows exit modal confirmation when close button is pressed', () => {
    const { getByText } = setup();

    fireEvent.press(getByText('Sulje'));

    expect(getByText('Haluatko varmasti poistua?')).toBeTruthy();
  });  
});
