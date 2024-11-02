import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppBarTab from '@components/app-bar/AppBarTab';

describe('AppBarTab Component', () => {
  const mockText = 'Projects';
  const mockTo = 'Main';

  it('renders the correct text', () => {
    const { getByText } = render(
      <NavigationContainer>
        <AppBarTab text={mockText} to={mockTo} />
      </NavigationContainer>
    );

    expect(getByText(mockText)).toBeTruthy();
  });
});
