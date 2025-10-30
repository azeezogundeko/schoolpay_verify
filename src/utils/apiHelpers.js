// Format error messages from API responses
export const formatErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map(e => e.msg).join(', ');
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

// Format success messages
export const formatSuccessMessage = (data, defaultMessage) => {
  return data?.message || defaultMessage;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Get stored admin user
export const getAdminUser = () => {
  const userStr = localStorage.getItem('adminUser');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

// Store admin user
export const setAdminUser = (user, token) => {
  localStorage.setItem('adminUser', JSON.stringify(user));
  localStorage.setItem('adminToken', token);
};

// Clear admin user
export const clearAdminUser = () => {
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminToken');
};
