import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  getInterviewers: () => api.get('/auth/interviewers'),
  getCandidates: () => api.get('/auth/candidates')
};

// Availability API
export const availabilityAPI = {
  getMyAvailability: (params) => api.get('/availability', { params }),
  getUserAvailability: (userId, params) => api.get(`/availability/user/${userId}`, { params }),
  addAvailability: (data) => api.post('/availability', data),
  parseAvailability: (text) => api.post('/availability/parse', { text }),
  saveParsedAvailability: (data) => api.post('/availability/save-parsed', data),
  updateAvailability: (id, data) => api.patch(`/availability/${id}`, data),
  deleteAvailability: (id) => api.delete(`/availability/${id}`)
};

// Matching API
export const matchingAPI = {
  findSlots: (data) => api.post('/matching/find-slots', data),
  proposeInterview: (data) => api.post('/matching/propose', data)
};

// Interview API
export const interviewAPI = {
  getInterviews: (params) => api.get('/interviews', { params }),
  getInterview: (id) => api.get(`/interviews/${id}`),
  selectSlot: (id, slotIndex) => api.post(`/interviews/${id}/select-slot`, { slotIndex }),
  confirmInterview: (id, data) => api.post(`/interviews/${id}/confirm`, data),
  cancelInterview: (id) => api.post(`/interviews/${id}/cancel`),
  submitFeedback: (id, data) => api.post(`/interviews/${id}/feedback`, data),
  getStats: () => api.get('/interviews/stats/overview')
};
