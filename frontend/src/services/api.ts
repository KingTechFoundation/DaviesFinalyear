const API_BASE = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('agriguide_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });

  if (res.status === 401) {
    localStorage.removeItem('agriguide_token');
    localStorage.removeItem('agriguide_user');
    localStorage.removeItem('agriguide_role');
    window.location.reload(); // Force app to re-initialize and redirect to landing
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════
export const authAPI = {
  register: (body: { name: string; email: string; phone?: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: async (body: { email: string; password: string }) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(body) });
    if (data.token) localStorage.setItem('agriguide_token', data.token);
    return data;
  },

  getProfile: () => request('/auth/profile'),
  updateProfile: (body: any) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  logout: () => localStorage.removeItem('agriguide_token'),
};

// ═══════════════════════════════════════
// FARMS
// ═══════════════════════════════════════
export const farmsAPI = {
  getAll: () => request('/farms'),
  create: (body: any) => request('/farms', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request(`/farms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request(`/farms/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════
// CROPS
// ═══════════════════════════════════════
export const cropsAPI = {
  getAll: () => request('/crops'),
  create: (body: any) => request('/crops', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request(`/crops/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request(`/crops/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════
// SOIL ANALYSIS
// ═══════════════════════════════════════
export const soilAPI = {
  getAll: () => request('/soil'),
  getById: (id: string) => request(`/soil/${id}`),
  create: (body: any) => request('/soil', { method: 'POST', body: JSON.stringify(body) }),
  analyzeSoil: (body: any) => request('/ai/analyze-soil', { method: 'POST', body: JSON.stringify(body) }),
};

// ═══════════════════════════════════════
// WEATHER
// ═══════════════════════════════════════
export const weatherAPI = {
  getCurrent: (location?: string) => request(`/weather${location ? `?location=${location}` : ''}`),
  getForecast: (location?: string) => request(`/weather/forecast${location ? `?location=${location}` : ''}`),
  getAlerts: (location?: string) => request(`/weather/alerts${location ? `?location=${location}` : ''}`),
};

// ═══════════════════════════════════════
// PEST DETECTION
// ═══════════════════════════════════════
export const pestsAPI = {
  getScans: () => request('/pests/scans'),
  createScan: (body: any) => request('/pests/scans', { method: 'POST', body: JSON.stringify(body) }),
  getCommonPests: (region?: string) => request(`/pests/common${region ? `?region=${region}` : ''}`),
  predictPest: (body: any) => request('/ai/predict-pest', { method: 'POST', body: JSON.stringify(body) }),
};

// ═══════════════════════════════════════
// FARMING TASKS
// ═══════════════════════════════════════
export const tasksAPI = {
  getAll: (status?: string) => request(`/tasks${status ? `?status=${status}` : ''}`),
  create: (body: any) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),
  getTimeline: () => request('/tasks/timeline'),
  upsertTimeline: (body: any) => request('/tasks/timeline', { method: 'POST', body: JSON.stringify(body) }),
};

// ═══════════════════════════════════════
// FARM INPUTS
// ═══════════════════════════════════════
export const inputsAPI = {
  getAll: () => request('/inputs'),
  create: (body: any) => request('/inputs', { method: 'POST', body: JSON.stringify(body) }),
};

// ═══════════════════════════════════════
// KNOWLEDGE BASE
// ═══════════════════════════════════════
export const knowledgeAPI = {
  getGuides: () => request('/knowledge/guides'),
  getVideos: () => request('/knowledge/videos'),
  getSchemes: () => request('/knowledge/schemes'),
  search: (q: string) => request(`/knowledge/search?q=${encodeURIComponent(q)}`),
  incrementViews: (id: string) => request(`/knowledge/${id}/view`, { method: 'POST' }),
};

// ═══════════════════════════════════════
// MARKET PRICES
// ═══════════════════════════════════════
export const marketAPI = {
  getAll: () => request('/market'),
  update: (id: string, body: any) => request(`/market/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// ═══════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════
export const analyticsAPI = {
  getDashboard: () => request('/analytics/dashboard'),
  getFarmerDashboard: () => request('/analytics/farmer-dashboard'),
  getAgronomistDashboard: () => request('/analytics/agronomist-dashboard'),
  getPolicymakerDashboard: () => request('/analytics/policymaker-dashboard'),
  getYield: () => request('/analytics/yield'),
  getRegional: () => request('/analytics/regional'),
  getAdoption: () => request('/analytics/adoption'),
  getImpact: () => request('/analytics/impact'),
};

// ═══════════════════════════════════════
// ADVISORY REQUESTS
// ═══════════════════════════════════════
export const advisoryAPI = {
  getAll: () => request('/advisory'),
  create: (body: any) => request('/advisory', { method: 'POST', body: JSON.stringify(body) }),
  respond: (id: string, body: any) => request(`/advisory/${id}/respond`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request(`/advisory/${id}`, { method: 'DELETE' }),
};

// ═══════════════════════════════════════
// AI CHAT
// ═══════════════════════════════════════
export const chatAPI = {
  getHistory: () => request('/chat'),
  sendMessage: (content: string) => request('/chat', { method: 'POST', body: JSON.stringify({ content }) }),
  clearHistory: () => request('/chat', { method: 'DELETE' }),
};

// ═══════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════
export const settingsAPI = {
  get: () => request('/settings'),
  update: (body: any) => request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
};
