import { useFormContext } from '@contexts/FormContext';

jest.mock('@contexts/FormContext', () => ({
  useFormContext: jest.fn(),
}));

export const mockUseFormContext = {
  formData: {
    personal_protection: { description: '', status: '', risk_type: 'scaffolding', images: [] },
    personal_fall_protection: { description: 'Valjaat käytössä', status: '', risk_type: 'scaffolding', images: [] },
    emergency_procedure: { description: 'Poistumistie merkitty', status: 'checked', risk_type: 'environment', images: [] },
    vehicle_traffic: { description: '', status: 'notRelevant', risk_type: 'environment', images: [] },
    slipping_tripping: { description: '', status: '', risk_type: 'environment', images: [] },
    surrounding_structures: { description: '', status: '', risk_type: 'environment', images: [] },
  },
  updateFormField: jest.fn(),
  getFormData: jest.fn((title, field) => mockUseFormContext.formData[title]?.[field]),
  task: 'Asennus',
  setTask: jest.fn(),
  scaffoldType: 'Työteline',
  setScaffoldType: jest.fn(),
  taskDesc: 'Test Description',
  setTaskDesc: jest.fn((newValue) => {
    mockUseFormContext.taskDesc = newValue;
  }),
  error: null,
};

beforeEach(() => {
  useFormContext.mockReturnValue(mockUseFormContext);
});