const PersianDate = require('persian-date');

const isValidPersianDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;
  
  const [year, month, day] = parts.map(Number);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (year < 1300 || year > 1500) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  return true;
};

exports.persianToGregorian = (persianDateStr) => {
  if (!isValidPersianDate(persianDateStr)) {
    throw new Error('Invalid Persian date format. Use YYYY/MM/DD');
  }

  const [year, month, day] = persianDateStr.split('/').map(Number);
  return new PersianDate()
    .year(year)
    .month(month - 1)
    .date(day)
    .toDate();
};

exports.getPersianDayRange = (persianDateStr) => {
  const gregDate = this.persianToGregorian(persianDateStr);
  const start = new Date(gregDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(gregDate);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

exports.formatPersianDateTime = (date) => {
  if (!date) return null;
  const pd = new PersianDate(date);
  return {
    date: pd.format('YYYY/MM/DD'),
    time: pd.format('HH:mm'),
    full: pd.format('HH:mm - YYYY/MM/DD')
  };
};

// utils/dateUtils.js
exports.isValidDate = (dateStr) => /^\d{4}\/\d{2}\/\d{2}$/.test(dateStr);
exports.parseDate = (dateStr) => new Date(dateStr).toISOString(); // Store dates in ISO format