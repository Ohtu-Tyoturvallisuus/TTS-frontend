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
    return `${surveyDate.toLocaleDateString()}, ${
      surveyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }`;
  }
};

/**
 * Formats a date string into a human-readable date and time.
 * @param {string} dateString - The ISO date string to format.
 * @returns {Object} An object containing the formatted `date` and `time` strings.
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return {
    date: `${day}.${month}.${year}`,
    time: `${hours}:${minutes}`,
  };
};