export const persianDate = (date) => {
  // Simple implementation - replace with proper Persian date conversion if needed
  return new Date(date).toLocaleDateString('fa-IR');
};

export const addZero = (num) => {
  return num < 10 ? `0${num}` : num;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};