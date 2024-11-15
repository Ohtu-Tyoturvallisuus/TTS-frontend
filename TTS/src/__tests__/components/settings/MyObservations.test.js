import { formatDate } from '@components/settings/MyObservations';

describe('formatDate function', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2024-11-15T09:45:00');
      expect(result).toEqual({
        date: '15.11.2024',
        time: '09:45',
      });
    });
});