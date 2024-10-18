import { render } from '@testing-library/react-native';
import LoadingErrorComponent from '@components/Loading';

describe('LoadingErrorComponent', () => {
  it('displays the loading indicator and title when loading is true', () => {
    const { getByText, getByTestId } = render(
      <LoadingErrorComponent loading={true} title="Loading data..." />
    );

    const loadingText = getByText('Loading data...');
    const activityIndicator = getByTestId('activity-indicator');

    expect(loadingText).toBeTruthy();
    expect(activityIndicator).toBeTruthy();
  });

  it('displays the error message when error is true', () => {
    const { getByText } = render(
      <LoadingErrorComponent loading={false} error={true} />
    );

    const errorText = getByText('Virhe lataamisessa');
    expect(errorText).toBeTruthy();
  });

  it('renders null when neither loading nor error is true', () => {
    const { queryByText, queryByTestId } = render(
      <LoadingErrorComponent loading={false} error={false} />
    );

    expect(queryByText('Loading data...')).toBeNull();
    expect(queryByText('Virhe lataamisessa')).toBeNull();
    expect(queryByTestId('activity-indicator')).toBeNull();
  });
});
