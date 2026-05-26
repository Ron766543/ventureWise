import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('vw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — auto logout
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vw_token');
      localStorage.removeItem('vw_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//  Auth 
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

//  Assessments 
export const assessmentAPI = {
  save: (data) => api.post('/assessments', data),
  get: () => api.get('/assessments')
};

//  Business Ideas 
export const ideasAPI = {
  getAll: (params) => api.get('/ideas', { params }),
  getRecommended: () => api.get('/ideas/recommended'),
  getById: (id) => api.get(`/ideas/${id}`),
  saveToggle: (id) => api.post(`/ideas/${id}/save`),
  create: (data) => api.post('/ideas', data),
  update: (id, data) => api.put(`/ideas/${id}`, data),
  delete: (id) => api.delete(`/ideas/${id}`)
};

//  Roadmaps 
export const roadmapAPI = {
  getById: (id) => api.get(`/roadmaps/${id}`),
  create: (data) => api.post('/roadmaps', data),
  update: (id, data) => api.put(`/roadmaps/${id}`, data)
};

//  Resources 
export const resourcesAPI = {
  getAll: (params) => api.get('/resources', { params }),
  create: (data) => api.post('/resources', data),
  approve: (id) => api.put(`/resources/${id}/approve`)
};

//  Mentors 
export const mentorsAPI = {
  getAll: (params) => api.get('/mentors', { params }),
  getById: (id) => api.get(`/mentors/${id}`),
  register: (data) => api.post('/mentors/register', data),
  askQuestion: (mentorId, data) => api.post(`/mentors/${mentorId}/question`, data),
  getMyQA: () => api.get('/mentors/qa/mine'),
  answerQuestion: (sessionId, answer) => api.put(`/mentors/qa/${sessionId}/answer`, { answer })
};

//  Progress 
export const progressAPI = {
  getAll: () => api.get('/progress'),
  create: (data) => api.post('/progress', data),
  update: (id, data) => api.put(`/progress/${id}`, data)
};

//  Admin 
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  verifyMentor: (id) => api.put(`/admin/mentors/${id}/verify`),
  getPendingContent: () => api.get('/admin/pending-content')
};

export default api;
