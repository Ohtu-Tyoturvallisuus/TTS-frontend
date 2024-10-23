import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MemoryRouter } from 'react-router-native';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import WorkSafetyForm from '@components/risk-form/RiskForm';
import * as apiService from '@services/apiService';
import enFormFields from '@lang/locales/en/formFields.json';
import fiFormFields from '@lang/locales/fi/formFields.json';

jest.mock('@services/apiService', () => ({
  postNewSurvey: jest.fn(),
  postRiskNotes: jest.fn(),
  fetchSurveyData: jest.fn(),
}));

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
  ...flattenFormFields(enFormFields),
  'closebutton.close': 'Sulje',
  'risknote.notRelevant': 'Ei koske',  
  'risknote.toBeNoted': 'Huomioitavaa',
  'risknote.notRelevant.en': 'Not relevant',  
  'risknote.toBeNoted.en': 'To be noted',
  'risknote.checked': 'Kunnossa',
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
};

jest.mock('react-i18next', () => {
  let language = 'fi';
  return {
    useTranslation: () => ({
      t: (key) => {
        if (language === 'en' && mockTranslations[`${key}.en`]) {
          return mockTranslations[`${key}.en`];
        }
        return mockTranslations[key] || key;
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

jest.mock('@components/buttons/CloseButton', () => {
  return jest.fn(({ onPress }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>Sulje</Text>
      </TouchableOpacity>
    );
  });
});

jest.mock('@components/SuccessAlert', () => {
  return jest.fn(({ message }) => {
    const { Text } = require('react-native');
    return <Text>{message}</Text>;
  });
});

function mockConsole() {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
}

describe('WorkSafetyForm Component', () => {
  const mockProject = { 
    id: 1, 
    project_name: 'Test Project', 
    project_id: '123' 
  };
  const mockSetSelectedProject = jest.fn();
  const mockSetSelectedSurveyURL = jest.fn();
  const mockSurveyURL = 'https://example.com/api/survey/1/';
  const mockSurveyData = {
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
      {
        note: 'emergency_procedure',
        description: 'Poistumistie merkitty',
        status: 'checked',
        risk_type: 'environment',
      },
      {
        note: 'vehicle_traffic',
        description: '',
        status: 'notRelevant',
        risk_type: 'environment',
      },
    ],
  };  

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ProjectSurveyContext.Provider value={{ 
          selectedProject: mockProject, 
          selectedSurveyURL: mockSurveyURL,
          setSelectedProject: mockSetSelectedProject, 
          setSelectedSurveyURL: mockSetSelectedSurveyURL 
        }}>
          <WorkSafetyForm />
        </ProjectSurveyContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
    mockConsole();
    apiService.fetchSurveyData.mockResolvedValue(mockSurveyData);
  });

  it('renders correctly and displays project information', () => {
    const { getByText } = renderComponent();

    expect(getByText('Test Project')).toBeTruthy();
    expect(getByText('123')).toBeTruthy();
  });

  it('submits the form and calls postNewSurvey', async () => {
    const { getByText } = renderComponent();
    apiService.postNewSurvey.mockResolvedValueOnce({ id: 1 });

    const submitButton = getByText('Lähetä');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(apiService.postNewSurvey).toHaveBeenCalled();
    });
  });

  it('shows success alert on successful submission', async () => {
    const { getByText } = renderComponent();

    apiService.postNewSurvey.mockResolvedValueOnce({ id: 1 });

    const submitButton = getByText('Lähetä');
    fireEvent.press(submitButton);

    await waitFor(() => expect(getByText('Riskimuistiinpanot lähetetty onnistuneesti')).toBeTruthy());
  });

  it('logs an error if API submission fails', async () => {
    const { getByText } = renderComponent();

    apiService.postNewSurvey.mockRejectedValueOnce(new Error('Submission failed'));

    const submitButton = getByText('Lähetä');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error during form submission:', expect.any(Error));
    });
  });

  it('closes the form on close button click', () => {
    const { getByText } = renderComponent();

    const closeButton = getByText('Sulje');
    fireEvent.press(closeButton);

    expect(mockSetSelectedProject).toHaveBeenCalledWith(null);
    expect(mockSetSelectedSurveyURL).toHaveBeenCalledWith(null);
  });

  it('renders risk notes correctly in Finnish', () => {
    const { getAllByText } = renderComponent();

    const notRelevantElements = getAllByText('Ei koske');
    expect(notRelevantElements.length).toBeGreaterThan(0);

    const toBeNotedElements = getAllByText('Huomioitavaa');
    expect(toBeNotedElements.length).toBeGreaterThan(0);
  });

  it('renders risk notes correctly in English', () => {
    const { changeLanguage } = require('react-i18next').useTranslation().i18n;
    changeLanguage('en');

    const { getAllByText } = renderComponent();

    // Check for the English translations of risk notes
    const notRelevantElements = getAllByText('Not relevant');
    expect(notRelevantElements.length).toBeGreaterThan(0);

    const toBeNotedElements = getAllByText('To be noted');
    expect(toBeNotedElements.length).toBeGreaterThan(0);
  });
});
