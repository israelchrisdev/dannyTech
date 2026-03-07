import api from '../services/api';

export const useProducts = () => {
  const getProducts = (params = {}) => api.get('/products', { params });
  const getProduct = (id) => api.get(`/products/${id}`);
  const createListing = (payload) => api.post('/listings', payload);

  return { getProducts, getProduct, createListing };
};
