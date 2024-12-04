import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormProvider, useFormContext } from '@contexts/FormContext';

jest.mock('@hooks/useFormFields', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    initialFormData: {
      personal_protection: { description: '', status: '', risk_type: 'scaffolding' },
      personal_fall_protection: { description: '', status: '', risk_type: 'scaffolding' },
    },
  })),
}));

const TestComponent = () => {
  const { Button, Text, TextInput } = require('react-native');
  const {
    updateFormField,
    getFormData,
    replaceFormData,
    updateTranslations,
    task,
    setTask,
    scaffoldType,
    setScaffoldType,
    taskDesc,
    setTaskDesc,
  } = useFormContext();

  return (
    <>
      <Text testID="task">{task}</Text>
      <Text testID="scaffoldType">{scaffoldType}</Text>
      <Text testID="taskDesc">{taskDesc}</Text>
      <Text testID="personal_protection_desc">{getFormData('personal_protection', 'description')}</Text>

      <Button title="Update Description" onPress={() => updateFormField('personal_protection', 'description', 'Updated Description')} />
      <Button title="Replace Form Data" onPress={() => replaceFormData({ personal_protection: { description: 'New Desc' } })} />
      <Button title="Update Translations" onPress={() => updateTranslations('personal_protection', 'invalid translation')} />
      
      <TextInput 
        testID="taskInput"
        onChangeText={setTask}
        value={task}
        placeholder="Enter Task"
      />
      <TextInput 
        testID="scaffoldTypeInput"
        onChangeText={setScaffoldType}
        value={scaffoldType}
        placeholder="Enter Scaffold Type"
      />
      <TextInput 
        testID="taskDescInput"
        onChangeText={setTaskDesc}
        value={taskDesc}
        placeholder="Enter Task Description"
      />
    </>
  );
};

const TranslationTestComponent = () => {
  const { updateTranslations } = useFormContext();
  const { Button } = require('react-native');

  return (
    <Button
      title="Test Translations"
      onPress={() =>
        updateTranslations('personal_protection', { key: 'value' })
      }
    />
  );
};

describe('FormProvider Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { getByTestId } = render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    expect(getByTestId('task').props.children).toStrictEqual([]);
    expect(getByTestId('scaffoldType').props.children).toStrictEqual([]);
    expect(getByTestId('taskDesc').props.children).toBe('');
    expect(getByTestId('personal_protection_desc').props.children).toBe('');
  });

  it('updates form field correctly', () => {
    const { getByTestId, getByText } = render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    fireEvent.press(getByText('Update Description'));

    expect(getByTestId('personal_protection_desc').props.children).toBe('Updated Description');
  });

  it('replaces form data correctly', () => {
    const { getByTestId, getByText } = render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    fireEvent.press(getByText('Replace Form Data'));

    expect(getByTestId('personal_protection_desc').props.children).toBe('New Desc');
  });

  it('updates task, scaffoldType, and taskDesc', () => {
    const { getByTestId } = render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    fireEvent.changeText(getByTestId('taskInput'), 'New Task');
    fireEvent.changeText(getByTestId('scaffoldTypeInput'), 'New Scaffold Type');
    fireEvent.changeText(getByTestId('taskDescInput'), 'New Task Description');

    expect(getByTestId('task').props.children).toBe('New Task');
    expect(getByTestId('scaffoldType').props.children).toBe('New Scaffold Type');
    expect(getByTestId('taskDesc').props.children).toBe('New Task Description');
  });

  it('does not update form data if updateTranslations is called with invalid translations', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const { getByTestId, getByText } = render(
      <FormProvider>
        <TestComponent />
      </FormProvider>
    );

    expect(getByTestId('personal_protection_desc').props.children).toBe('');

    fireEvent.press(getByText('Update Translations'));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Translations must be a dictionary');
    expect(getByTestId('personal_protection_desc').props.children).toBe('');
  
    consoleErrorSpy.mockRestore();
  });

  it('updates translations correctly with valid input', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  
    const { getByText } = render(
      <FormProvider>
        <TranslationTestComponent />
      </FormProvider>
    );
  
    fireEvent.press(getByText('Test Translations'));
  
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Updating personal_protection.translations')
    );
  
    consoleLogSpy.mockRestore();
  });
});

describe('FormProvider - resetFormData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ResetFormComponent = () => {
    const { resetFormData } = useFormContext();
    const { Button } = require('react-native');

    return <Button title="Reset Form" onPress={resetFormData} />;
  };

  it('resets form data to initial values', () => {
    const { getByTestId, getByText } = render(
      <FormProvider>
        <TestComponent />
        <ResetFormComponent />
      </FormProvider>
    );

    fireEvent.changeText(getByTestId('taskInput'), 'New Task');
    fireEvent.changeText(getByTestId('scaffoldTypeInput'), 'New Scaffold Type');
    fireEvent.changeText(getByTestId('taskDescInput'), 'New Task Description');
    fireEvent.press(getByText('Update Description'));

    expect(getByTestId('task').props.children).toBe('New Task');
    expect(getByTestId('scaffoldType').props.children).toBe('New Scaffold Type');
    expect(getByTestId('taskDesc').props.children).toBe('New Task Description');
    expect(getByTestId('personal_protection_desc').props.children).toBe('Updated Description');

    fireEvent.press(getByText('Reset Form'));

    expect(getByTestId('task').props.children).toStrictEqual([]);
    expect(getByTestId('scaffoldType').props.children).toStrictEqual([]);
    expect(getByTestId('taskDesc').props.children).toBe('');
    expect(getByTestId('personal_protection_desc').props.children).toBe('');
  });

  it('logs a message when resetFormData is called', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const { getByText } = render(
      <FormProvider>
        <ResetFormComponent />
      </FormProvider>
    );

    fireEvent.press(getByText('Reset Form'));

    expect(consoleLogSpy).toHaveBeenCalledWith('Resetting form data context');

    consoleLogSpy.mockRestore();
  });
});