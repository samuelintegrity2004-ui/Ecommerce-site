import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getUserProfile = () => API.get('/auth/profile');

export const getProducts = (keyword = '', category = '') =>
  API.get(`/products?keyword=${keyword}&category=${category}`);
export const getImageProducts = () => API.get('/products/gallery/images');
export const getFeaturedProducts = () => API.get('/products/featured');
export const getProductById = (id) => API.get(`/products/${id}`);

export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity, product) =>
  API.post('/cart', { productId, quantity, product });
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart');
