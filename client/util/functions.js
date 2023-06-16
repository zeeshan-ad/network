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