import * as Localization from 'expo-localization';

/**
 * Formats a date string into a relative or absolute time description.
 * @param {string} dateString - The ISO date string to format.
 * @param {Function} t - Translation function from `react-i18next`.
 * @returns {string} A formatted date string.
 */
export const formatRelativeDate = (dateString, t) => {
  const surveyDate = new Date(dateString);
  const now = new Date();
  const timeDifference = now - surveyDate;
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (minutesDifference < 60) {
    return t('projectsurveylistcontainer.minutesAgo', { count: minutesDifference });
  } else if (hoursDifference < 24) {
    return t('projectsurveylistcontainer.hoursAgo', { count: hoursDifference });
  } else if (daysDifference <= 14) {
    return t('projectsurveylistcontainer.daysAgo', { count: daysDifference });
  } else {
    const { date, time } = formatDate(surveyDate.toISOString());
    return `${date}, ${time}`;
  }
};

/**
 * Formats a date string into a human-readable date and time.
 * @param {string} dateString - The ISO date string to format.
 * @returns {Object} An object containing the formatted `date` and `time` strings.
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { date: 'Invalid Date', time: 'Invalid Time' };
  }

  const userLocale = Localization.getLocales()?.[0]?.languageTag || 'fi-FI';

  const formattedDate = date.toLocaleDateString(userLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedTime = date.toLocaleTimeString(userLocale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
};
