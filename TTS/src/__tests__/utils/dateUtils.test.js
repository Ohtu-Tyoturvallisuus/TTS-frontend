import { formatRelativeDate, formatDate } from '@utils/dateUtils';

describe('dateUtils', () => {
  describe('formatRelativeDate', () => {
    const tMock = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return minutes ago if less than 60 minutes have passed', () => {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

      tMock.mockImplementation((key, { count }) => `${count} minutes ago`);

      const result = formatRelativeDate(tenMinutesAgo, tMock);
      expect(result).toBe('10 minutes ago');
      expect(tMock).toHaveBeenCalledWith('projectsurveylistcontainer.minutesAgo', { count: 10 });
    });

    it('should return hours ago if less than 24 hours have passed', () => {
      const now = new Date();
      const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString();

      tMock.mockImplementation((key, { count }) => `${count} hours ago`);

      const result = formatRelativeDate(fiveHoursAgo, tMock);
      expect(result).toBe('5 hours ago');
      expect(tMock).toHaveBeenCalledWith('projectsurveylistcontainer.hoursAgo', { count: 5 });
    });

    it('should return days ago if less than 14 days have passed', () => {
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();

      tMock.mockImplementation((key, { count }) => `${count} days ago`);

      const result = formatRelativeDate(tenDaysAgo, tMock);
      expect(result).toBe('10 days ago');
      expect(tMock).toHaveBeenCalledWith('projectsurveylistcontainer.daysAgo', { count: 10 });
    });

    it('should return formatted date and time if more than 14 days have passed', () => {
      const now = new Date();
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

      const result = formatRelativeDate(fifteenDaysAgo.toISOString(), tMock);
      const expectedDate = fifteenDaysAgo.toLocaleDateString();
      const expectedTime = fifteenDaysAgo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      expect(result).toBe(`${expectedDate}, ${expectedTime}`);
      expect(tMock).not.toHaveBeenCalled();
    });
  });

  describe('formatDate', () => {
    it('should format the date string into a readable date and time using local timezone', () => {
      const dateString = '2024-11-15T09:45:00Z';
      const localTimezoneDate = new Date(dateString);
      const result = formatDate(localTimezoneDate.toISOString());

      expect(result).toEqual({
        date: '15.11.2024',
        time: '11:45',
      });
    });

    it('should correctly format single-digit months and days using local timezone', () => {
      const dateString = '2024-06-05T08:05:00Z';
      const localTimezoneDate = new Date(dateString);
      const result = formatDate(localTimezoneDate.toISOString());

      expect(result).toEqual({
        date: '05.06.2024',
        time: '11:05',
      });
    });

    it('should handle invalid dates gracefully', () => {
      const dateString = 'invalid-date';
      const result = formatDate(dateString);

      expect(result.date).toBe('NaN.NaN.NaN');
      expect(result.time).toBe('NaN:NaN');
    });
  });
});
