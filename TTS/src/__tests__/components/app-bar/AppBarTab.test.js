import { render } from '@testing-library/react-native';
import { MemoryRouter } from 'react-router-native';
import AppBarTab from '@components/app-bar/AppBarTab'; // Adjust path as needed

describe('AppBarTab Component', () => {
  const mockText = 'Projects';
  const mockTo = '/projects';

  it('renders the correct text', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AppBarTab text={mockText} to={mockTo} />
      </MemoryRouter>
    );

    expect(getByText(mockText)).toBeTruthy();
  });
});
