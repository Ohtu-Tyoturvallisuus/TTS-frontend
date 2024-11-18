import { formatRelativeDate, formatDate } from '@utils/dateUtils';
import * as Localization from 'expo-localization';

jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => ['fi-FI']),
}));

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

    it('should return formatted date and time if more than 14 days have passed', () => {
      const now = new Date();
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    
      const result = formatRelativeDate(fifteenDaysAgo.toISOString(), tMock);

      const expectedDate = fifteenDaysAgo.toLocaleDateString('fi-FI', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const expectedTime = fifteenDaysAgo.toLocaleTimeString('fi-FI', {
        hour: '2-digit',
        minute: '2-digit',
      });
    
      expect(result).toBe(`${expectedDate}, ${expectedTime}`);
      expect(tMock).not.toHaveBeenCalled();
    });    
  });

  describe('formatDate', () => {
    beforeEach(() => {
      jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
        timeZone: 'Europe/Helsinki',
      });
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
    
    it('should format the date string into a readable date and time using the user locale', () => {
      const dateString = '2024-11-15T09:45:00Z';
      const result = formatDate(dateString);
  
    const expectedDate = new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const expectedTime = new Date(dateString).toLocaleTimeString('fi-FI', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    expect(result).toEqual({
      date: expectedDate,
      time: expectedTime,
    });
    });

    it('should correctly format single-digit months and days using the user locale', () => {
      const dateString = '2024-06-05T08:05:00Z';
      const result = formatDate(dateString);
  
    const expectedDate = new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const expectedTime = new Date(dateString).toLocaleTimeString('fi-FI', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    expect(result).toEqual({
      date: expectedDate,
      time: expectedTime,
    });
    });

    it('should handle invalid dates gracefully', () => {
      const dateString = 'invalid-date';
      const result = formatDate(dateString);

      expect(result.date).toBe('Invalid Date');
      expect(result.time).toBe('Invalid Time');
    });

    it('should use the user’s locale from expo-localization', () => {
      Localization.getLocales.mockReturnValue(['sv-SE']);
      const dateString = '2024-06-05T08:05:00Z';
      const result = formatDate(dateString);

      const expectedDate = new Date(dateString).toLocaleDateString('sv-SE');
      const expectedTime = new Date(dateString).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
      });

      expect(result).toEqual({
        date: expectedDate,
        time: expectedTime,
      });
      expect(Localization.getLocales).toHaveBeenCalled();
    });
  });
  
  it('should default to fi-FI locale if Localization.getLocales returns undefined', () => {
    Localization.getLocales.mockReturnValueOnce(undefined);
    const dateString = '2024-06-05T08:05:00Z';
    const result = formatDate(dateString);
  
    const expectedDate = new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const expectedTime = new Date(dateString).toLocaleTimeString('fi-FI', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    expect(result).toEqual({
      date: expectedDate,
      time: expectedTime,
    });
    expect(Localization.getLocales).toHaveBeenCalled();
  });  
});
