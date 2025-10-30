import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      // Only redirect if we're on an admin page
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin-login') {
        window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email, password, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// Payment Code API
export const paymentCodeAPI = {
  generate: async (data) => {
    const response = await api.post('/payment-codes', data);
    return response.data;
  },

  verify: async (code) => {
    const response = await api.get(`/payment-codes/${code}/verify`);
    return response.data;
  },

  getDetails: async (code) => {
    const response = await api.get(`/payment-codes/${code}`);
    return response.data;
  }
};

// Receipt API
export const receiptAPI = {
  upload: async (formData) => {
    const response = await api.post('/receipts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/receipts?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/receipts/${id}`);
    return response.data;
  },

  getByReference: async (referenceId) => {
    const response = await api.get(`/receipts/reference/${referenceId}`);
    return response.data;
  },

  updateStatus: async (id, status, adminNotes = '') => {
    const response = await api.patch(`/receipts/${id}`, { status, adminNotes });
    return response.data;
  },

  bulkUpdate: async (ids, status, adminNotes = '') => {
    const response = await api.post('/receipts/bulk-update', { ids, status, adminNotes });
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },

  getActivities: async (limit = 10) => {
    const response = await api.get(`/dashboard/activities?limit=${limit}`);
    return response.data;
  }
};

export default api;
