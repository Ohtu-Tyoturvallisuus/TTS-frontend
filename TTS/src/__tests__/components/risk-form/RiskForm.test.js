import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProjectSurveyContext } from '@contexts/ProjectSurveyContext';
import { UserContext } from '@contexts/UserContext';
import { FormProvider } from '@contexts/FormContext';
import RiskForm from '@components/risk-form/RiskForm';
import fiFormFields from '@lang/locales/fi/formFields.json';
import { NavigationProvider } from '@contexts/NavigationContext';

jest.mock('@hooks/useFetchSurveyData', () => jest.fn());

const mockUseFetchSurveyData = require('@hooks/useFetchSurveyData');

jest.mock('@components/Loading', () => jest.fn(({ loading, error, title }) => {
  const { View, Text } = require('react-native');
  return (
    <View>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <Text>{title}</Text>
    </View>
  );
}));

jest.mock('react-native-sectioned-multi-select', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');

  const MockedComponent = ({ items, selectedItems, onSelectedItemsChange, selectText }) => (
    <View>
      <Text>{selectText}</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            const newSelection = selectedItems.includes(item.id)
              ? selectedItems.filter((id) => id !== item.id)
              : [...selectedItems, item.id];
            onSelectedItemsChange(newSelection);
          }}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  MockedComponent.displayName = 'MockedComponent';
  return MockedComponent;
});

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: 'Ionicons',
  };
});

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

const mockScaffoldItems = [
  { id: 'workScaffold', name: 'Working Scaffold' },
  { id: 'accessessScaffold', name: 'Access Scaffold' },
];

jest.mock('@utils/scaffoldUtils', () => ({
  useScaffoldItems: jest.fn(() => mockScaffoldItems),
}));

jest.mock('@services/formSubmission', () => ({
  submitForm: jest.fn(),
}));

jest.mock('@contexts/TranslationContext', () => ({
  useTranslationLanguages: jest.fn(() => ({
    setToLangs: jest.fn(),
    toLangs: [],
    fromLang: 'fi'
  })),
}));

const mockUserContext = {
  newUserSurveys: false,
  setNewUserSurveys: jest.fn(),
};

jest.mock('@react-navigation/native', () => {
  const originalModule = jest.requireActual('@react-navigation/native');
  return {
    ...originalModule,
    useNavigation: () => ({
      navigate: jest.fn(),
      addListener: jest.fn((event, callback) => {
        if (event === 'beforeRemove') {
          callback({
            preventDefault: jest.fn(),
          });
        }
      }),
    }),
  };
});

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
        <NavigationProvider>
          <UserContext.Provider value={mockUserContext}>
            <ProjectSurveyContext.Provider value={contextValue}>
              <FormProvider>
                <RiskForm onFocusChange={mockOnFocusChange} />
              </FormProvider>
            </ProjectSurveyContext.Provider>
          </UserContext.Provider>
        </NavigationProvider>
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
    mockUseFetchSurveyData.mockReturnValue({
      surveyData: {
        task: ['Asennus'],
        scaffold_type: ['Työteline'],
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
    });
    const { getByText } = setup();

    expect(getByText('Projektin nimi:')).toBeTruthy();
    expect(getByText('Test Project')).toBeTruthy();
    expect(getByText('Projektin ID:')).toBeTruthy();
    expect(getByText('1234')).toBeTruthy();
  });

  it('renders FilledRiskForm with survey data', async () => {
    mockUseFetchSurveyData.mockReturnValue({
      surveyData: {
        task: ['Asennus'],
        scaffold_type: ['Työteline'],
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
    });

    const { getByText } = setup();

    fireEvent.press(getByText('Esikatsele lomake'));

    await waitFor(() => {
      expect(getByText('Valjaat käytössä')).toBeTruthy();
    });
  });

  it('shows exit modal confirmation when close button is pressed', () => {
    mockUseFetchSurveyData.mockReturnValue({
      surveyData: {
        task: ['Asennus'],
        scaffold_type: ['Työteline'],
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
    });
    const { getByText } = setup();

    fireEvent.press(getByText('Sulje'));

    expect(getByText('Haluatko varmasti poistua?')).toBeTruthy();
  });
});
