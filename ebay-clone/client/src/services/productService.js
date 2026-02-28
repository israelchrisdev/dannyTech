import api from './api';

class ProductService {
  async getProducts(params) {
    const response = await api.get('/products', { params });
    return response.data;
  }

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData) {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async updateProduct(id, productData) {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  async placeBid(productId, amount) {
    const response = await api.post(`/products/${productId}/bids`, { amount });
    return response.data;
  }

  async getBids(productId) {
    const response = await api.get(`/products/${productId}/bids`);
    return response.data;
  }

  async addReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  }

  async getReviews(productId, params) {
    const response = await api.get(`/products/${productId}/reviews`, { params });
    return response.data;
  }

  async toggleWatchlist(productId) {
    const response = await api.post(`/products/${productId}/watchlist`);
    return response.data;
  }

  async getWatchlist() {
    const response = await api.get('/products/watchlist');
    return response.data;
  }
}

export default new ProductService();