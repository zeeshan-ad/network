import moment from 'moment-timezone';
import { BASE_URL } from './constants';

// used in sign up dob
export function convertDateFormat(dateString) {
  const parts = dateString.split('/');
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  // Create a new Date object using the components in yyyy-mm-dd format
  const newDate = new Date(`${year}-${month}-${day}`);

  // Extract the year, month, and day components from the new Date object
  const newYear = newDate.getFullYear();
  const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
  const newDay = String(newDate.getDate()).padStart(2, '0');

  // Construct the new date string in yyyy-mm-dd format
  const newDateString = `${newYear}-${newMonth}-${newDay}`;

  return newDateString;
}


// for date conversion

export function formatTime(timestamp, type) {
  const localTime = moment.utc(timestamp, 'YYYY-MM-DD HH:mm:ss').local();

  const now = moment();
  const diffInSeconds = now.diff(localTime, 'seconds');
  const diffInMinutes = now.diff(localTime, 'minutes');
  const diffInHours = now.diff(localTime, 'hours');
  const diffInDays = now.diff(localTime, 'days');

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays === 1) {
    return 'A day ago';
  } else {
    if (type === 'profile')
      return localTime.format('Do MMM YYYY');
    return localTime.format('DD/MM/YYYY h:mm a');
  }
}

export function extractMomentsForPrefetch(data) {
  const moments = [];

  const extractFromObject = (obj) => {
    if (Array.isArray(obj)) {
      obj.forEach((item) => extractFromObject(item));
    } else if (typeof obj === "object" && obj !== null) {
      if (obj.hasOwnProperty("moment")) {
        moments.push(BASE_URL + obj.moment);
      }
      Object.values(obj).forEach((value) => extractFromObject(value));
    }
  };

  extractFromObject(data);

  return moments;
}