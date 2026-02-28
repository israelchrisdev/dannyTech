import api from './api';

class UserService {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await api.patch('/users/profile', profileData);
    return response.data;
  }

  async updateAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.patch('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async updatePassword(currentPassword, newPassword) {
    const response = await api.patch('/users/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  async getOrders(params) {
    const response = await api.get('/users/orders', { params });
    return response.data;
  }

  async getOrderById(id) {
    const response = await api.get(`/users/orders/${id}`);
    return response.data;
  }

  async getMessages(params) {
    const response = await api.get('/users/messages', { params });
    return response.data;
  }

  async sendMessage(receiverId, content, productId) {
    const response = await api.post('/users/messages', {
      receiverId,
      content,
      productId
    });
    return response.data;
  }

  async getNotifications(params) {
    const response = await api.get('/users/notifications', { params });
    return response.data;
  }

  async markNotificationRead(id) {
    const response = await api.patch(`/users/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsRead() {
    const response = await api.patch('/users/notifications/read-all');
    return response.data;
  }

  async getStore() {
    const response = await api.get('/users/store');
    return response.data;
  }

  async updateStore(storeData) {
    const formData = new FormData();
    
    Object.keys(storeData).forEach(key => {
      if (key === 'logo' || key === 'banner') {
        if (storeData[key]) {
          formData.append(key, storeData[key]);
        }
      } else {
        formData.append(key, storeData[key]);
      }
    });

    const response = await api.patch('/users/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

export default new UserService();