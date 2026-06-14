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

export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

export const getUsers = () => API.get('/users');
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const getAdminStats = () => API.get('/admin/stats');
