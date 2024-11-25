import { useTranslation } from 'react-i18next';
import getProjectAreas from '@utils/projectAreas';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('getProjectAreas', () => {
  beforeEach(() => {
    useTranslation.mockReturnValue({
      t: (key) => {
        const translations = {
          'projectlist.chooseAll': 'Choose All',
        };
        return translations[key] || key;
      },
    });
  });

  it('should return project areas with the correct translations', () => {
    const projectAreas = getProjectAreas();
    expect(projectAreas).toContainEqual(['Choose All', '']);
    expect(projectAreas).toContainEqual(['Kataja Event', '3100']);
  });

  it('should handle missing translations gracefully', () => {
    useTranslation.mockReturnValue({
      t: () => undefined, // Simulate missing translation
    });

    const projectAreas = getProjectAreas();
    expect(projectAreas[0][0]).toBeUndefined(); // Check the first translation key
    expect(projectAreas).toContainEqual(['Kataja Event', '3100']);
  });
});
