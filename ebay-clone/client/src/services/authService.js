import api from './api';

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    await api.post('/auth/logout').catch(() => {});
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await api.post('/auth/refresh-token', { refreshToken });
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
    return response.data;
  }

  async forgotPassword(email) {
    return await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return await api.post(`/auth/reset-password/${token}`, { password });
  }

  async verifyEmail(token) {
    return await api.get(`/auth/verify-email/${token}`);
  }

  getCurrentUser() {
    return api.get('/users/profile');
  }
}

export default new AuthService();