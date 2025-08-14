import { useState } from 'react';

const useLoading = (initialState = {}) => {
  const [loading, setLoading] = useState(initialState);
  
  const startLoading = (key) => {
    setLoading(prev => ({ ...prev, [key]: true }));
  };
  
  const stopLoading = (key) => {
    setLoading(prev => ({ ...prev, [key]: false }));
  };
  
  return { loading, startLoading, stopLoading };
};

export default useLoading;