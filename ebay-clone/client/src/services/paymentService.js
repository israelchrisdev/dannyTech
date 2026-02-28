import api from './api';

class PaymentService {
  async createPaymentIntent(orderId) {
    const response = await api.post('/payments/create-intent', { orderId });
    return response.data;
  }

  async confirmPayment(paymentIntentId) {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  }

  async getPaymentMethods() {
    const response = await api.get('/payments/methods');
    return response.data;
  }

  async addPaymentMethod(paymentMethodId) {
    const response = await api.post('/payments/methods', { paymentMethodId });
    return response.data;
  }

  async removePaymentMethod(paymentMethodId) {
    const response = await api.delete(`/payments/methods/${paymentMethodId}`);
    return response.data;
  }

  async getPayoutHistory(params) {
    const response = await api.get('/payments/payouts', { params });
    return response.data;
  }

  async requestPayout(amount) {
    const response = await api.post('/payments/payouts', { amount });
    return response.data;
  }

  async getTransactionHistory(params) {
    const response = await api.get('/payments/transactions', { params });
    return response.data;
  }
}

export default new PaymentService();