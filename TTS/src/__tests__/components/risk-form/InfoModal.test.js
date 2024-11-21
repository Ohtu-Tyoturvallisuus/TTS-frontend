import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import InfoModal from '@components/risk-form/InfoModal';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'descriptionmodal.otherHazards': 'Other Hazards',
        'riskform.test.description': 'Test Description',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('@components/CustomModal', () => {
  const CustomModalMock = ({ children, visible }) => (
    <>{visible && <>{children}</>}</>
  );
  CustomModalMock.displayName = 'CustomModalMock';
  return CustomModalMock;
});

jest.mock('@components/buttons/CloseButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  const MockedCloseButton = (props) => {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <Text>Sulje</Text>
      </TouchableOpacity>
    );
  };
  MockedCloseButton.displayName = 'MockedCloseButton';
  return MockedCloseButton;
});

describe('InfoModal Component', () => {
  const title = 'riskform.test';
  const renderTitle = (title) => {
    return `Custom: ${title}`; // Mocking the renderTitle function
  };

  it('renders the InfoModal component correctly', () => {
    const { getByTestId } = render(<InfoModal title={title} />);
    const iconButton = getByTestId('info-icon-button');
    expect(iconButton).toBeTruthy();
  });

  it('opens the modal when the TouchableOpacity is pressed', async () => {
    const { getByTestId, getByText } = render(<InfoModal title={title} renderTitle={renderTitle} />);

    const iconButton = getByTestId('info-icon-button');
    fireEvent.press(iconButton);

    await waitFor(() => {
      expect(getByText('Test Description')).toBeTruthy();
    });
  });

  it('displays the correct text for other titles', async () => {
    const { getByTestId, getByText } = render(
      <InfoModal title="riskform.otherScaffolding" />
    );

    const iconButton = getByTestId('info-icon-button');
    fireEvent.press(iconButton);

    await waitFor(() => {
      expect(getByText('Other Hazards')).toBeTruthy();
    });
  });

  it('displays correct text for other titles with renderTitle', async () => {
    const { getByTestId, getByText } = render(
      <InfoModal title="riskform.otherEnvironment" renderTitle={renderTitle} />
    );

    const iconButton = getByTestId('info-icon-button');
    fireEvent.press(iconButton);

    await waitFor(() => {
      expect(getByText('Custom: riskform.otherEnvironment')).toBeTruthy();
    });
  });

  it('closes the modal when the CloseButton is pressed', async () => {
    const { getByTestId, queryByText, getByText } = render(
      <InfoModal title={title} renderTitle={renderTitle} />
    );

    const iconButton = getByTestId('info-icon-button');
    fireEvent.press(iconButton);

    const closeButton = getByText('Sulje');
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(queryByText('Test Description')).toBeNull();
    });
  });
});
