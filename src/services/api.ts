import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { fullName: string; mobileNumber: string; password: string }) =>
    api.post('/auth/register', data),
  verifyOtp: (data: { tempToken: string; otp: string }) =>
    api.post('/auth/verify-otp', data),
  login: (data: { mobileNumber: string; password: string }) =>
    api.post('/auth/login', data),
  loginOtp: (data: { mobileNumber: string }) =>
    api.post('/auth/login-otp', data),
  verifyLoginOtp: (data: { tempToken: string; otp: string }) =>
    api.post('/auth/verify-login-otp', data),
  forgotPassword: (data: { mobileNumber: string }) =>
    api.post('/auth/forgot-password', data),
  resetPassword: (data: { tempToken: string; otp: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/me'),
};

// Admin APIs
export const adminAPI = {
  // Users
  getUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, data: { isActive: boolean }) =>
    api.put(`/admin/users/${id}/status`, data),
  
  // KYC
  getPendingKYC: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/kyc/pending', { params }),
  verifyKYC: (kycId: string, data: { status: string; remarks?: string }) =>
    api.put(`/admin/kyc/${kycId}/verify`, data),
  
  // Devices
  getDevices: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/devices', { params }),
  registerDevice: (data: { deviceId: string; deviceName: string; deviceType: string }) =>
    api.post('/admin/devices', {
      device_id: data.deviceId,
      device_name: data.deviceName,
      device_type: data.deviceType,
    }),
  updateDevice: (deviceId: string, data: { device_name: string; device_type: string }) =>
    api.put(`/admin/devices/${deviceId}`, data),
  deleteDevice: (deviceId: string) =>
    api.delete(`/admin/devices/${deviceId}`),
  
  // Subscriptions
  getSubscriptions: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/subscriptions', { params }),
  
  // Crops
  getCrops: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get('/crops', { params }),
  createCrop: (data: object) => api.post('/admin/crops', data),
  updateCrop: (cropId: string, data: object) => api.put(`/admin/crops/${cropId}`, data),
  deleteCrop: (cropId: string) => api.delete(`/admin/crops/${cropId}`),
  
  // Master Data
  getMasterData: (params?: { type?: string }) =>
    api.get('/admin/master-data', { params }),
  createMasterData: (data: { type: string; name: string }) =>
    api.post('/admin/master-data', data),
  updateMasterData: (id: string, data: { name?: string; isActive?: boolean }) =>
    api.put(`/admin/master-data/${id}`, data),
  deleteMasterData: (id: string) => api.delete(`/admin/master-data/${id}`),
  
  // Dashboard
  getDashboardAnalytics: () => api.get('/admin/analytics/dashboard'),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/profile/me'),
  updateProfile: (data: object) => api.put('/profile/update', data),
};

// KYC APIs
export const kycAPI = {
  submitKYC: (data: object) => api.post('/kyc/submit', data),
  getMyKYC: () => api.get('/kyc/my-kyc'),
  updateKYC: (kycId: string, data: object) => api.put(`/kyc/update/${kycId}`, data),
  addPlot: (data: object) => api.post('/kyc/add-plot', data),
};

// Crops APIs
export const cropsAPI = {
  getCrops: (params?: { page?: number; limit?: number; category?: string; search?: string }) =>
    api.get('/crops', { params }),
  getCategories: () => api.get('/crops/categories'),
  getCropDetails: (cropId: string) => api.get(`/crops/${cropId}`),
};

// Alerts APIs
export const alertsAPI = {
  getMyAlerts: (params?: { page?: number; limit?: number; isRead?: boolean }) =>
    api.get('/alerts/my-alerts', { params }),
  markAsRead: (alertId: string) => api.put(`/alerts/${alertId}/read`),
  markAllAsRead: () => api.put('/alerts/read-all'),
};

export default api;
