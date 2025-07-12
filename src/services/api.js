export const BASE_URL = 'http://localhost:3003';
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
    console.log(`🔍 API Request to ${endpoint}:`, {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      bodyObj: options.body,
      bodyString: config.body
    });
  }
  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error en petición API ${endpoint}:`, error);
    throw error;
  }
};
export { apiRequest };
export const usuariosAPI = {
  getAll: () => apiRequest('/api/users'),
  getById: (id) => apiRequest(`/api/users/${id}`),
  create: (userData) => apiRequest('/api/users', {
    method: 'POST',
    body: userData,
  }),
  update: (id, userData) => apiRequest(`/api/users/${id}`, {
    method: 'PUT',
    body: userData,
  }),
  delete: (id) => apiRequest(`/api/users/${id}`, {
    method: 'DELETE',
  }),
  login: (credentials) => apiRequest('/api/users/login', {
    method: 'POST',
    body: credentials,
  }),
  register: (userData) => apiRequest('/api/users/register', {
    method: 'POST',
    body: userData,
  }),
  resetPassword: (resetData) => apiRequest('/api/users/reset-password', {
    method: 'POST',
    body: resetData,
  }),
};
export const productosAPI = {
  getAll: () => apiRequest('/api/products'),
  getById: (id) => apiRequest(`/api/products/${id}`),
  create: (productData) => apiRequest('/api/products', {
    method: 'POST',
    body: productData,
  }),
  update: (id, productData) => apiRequest(`/api/products/${id}`, {
    method: 'PUT',
    body: productData,
  }),
  delete: (id) => apiRequest(`/api/products/${id}`, {
    method: 'DELETE',
  }),
  search: (query) => apiRequest(`/api/products/search?q=${encodeURIComponent(query)}`),
  getByCategory: (categoryId) => apiRequest(`/api/products/category/${categoryId}`),
};
export const categoriasAPI = {
  getAll: () => apiRequest('/api/categories'),
  getById: (id) => apiRequest(`/api/categories/${id}`),
  create: (categoryData) => apiRequest('/api/categories', {
    method: 'POST',
    body: categoryData,
  }),
  update: (id, categoryData) => apiRequest(`/api/categories/${id}`, {
    method: 'PUT',
    body: categoryData,
  }),
  delete: (id) => apiRequest(`/api/categories/${id}`, {
    method: 'DELETE',
  }),
};
export const ordenesAPI = {
  getAll: () => apiRequest('/api/orders'),
  getById: (id) => apiRequest(`/api/orders/${id}`),
  create: (orderData) => apiRequest('/api/orders', {
    method: 'POST',
    body: orderData,
  }),
  update: (id, orderData) => apiRequest(`/api/orders/${id}`, {
    method: 'PUT',
    body: orderData,
  }),
  delete: (id) => apiRequest(`/api/orders/${id}`, {
    method: 'DELETE',
  }),
  getByUser: (userId) => apiRequest(`/api/orders/user/${userId}`),
  updateStatus: (id, estado) => apiRequest(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: { estado },
  }),
};
export const orderItemsAPI = {
  getAll: () => apiRequest('/api/order-items'),
  getByOrder: (orderId) => apiRequest(`/api/order-items/order/${orderId}`),
  create: (itemData) => apiRequest('/api/order-items', {
    method: 'POST',
    body: itemData,
  }),
  update: (id, itemData) => apiRequest(`/api/order-items/${id}`, {
    method: 'PUT',
    body: itemData,
  }),
  delete: (id) => apiRequest(`/api/order-items/${id}`, {
    method: 'DELETE',
  }),
};
export const pagosAPI = {
  getAll: () => apiRequest('/api/pagos'),
  getById: (id) => apiRequest(`/api/pagos/${id}`),
  create: (paymentData) => apiRequest('/api/pagos', {
    method: 'POST',
    body: paymentData,
  }),
  getByOrder: (orderId) => apiRequest(`/api/pagos/order/${orderId}`),
  getByUser: (userId) => apiRequest(`/api/pagos/user/${userId}`),
};
export const tiposTarjetaAPI = {
  getAll: () => apiRequest('/api/tipos-tarjeta'),
  getById: (id) => apiRequest(`/api/tipos-tarjeta/${id}`),
};
export const estadosOrdenAPI = {
  getAll: () => apiRequest('/api/estados-orden'),
  getById: (id) => apiRequest(`/api/estados-orden/${id}`),
};
export const initializeTestData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/init-test-data`, {
      method: 'POST',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error inicializando datos de prueba:', error);
    throw error;
  }
};
export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    const data = await response.json();
    return data.result?.includes('FUNCIONA CORRECTAMENTE');
  } catch (error) {
    console.error('Error conectando con el backend:', error);
    return false;
  }
};
export const cartAPI = {
  getCartByUser: (userId) => apiRequest(`/api/carts/user/${userId}`),
  getById: (id) => apiRequest(`/api/carts/${id}`),
  create: (cartData) => apiRequest('/api/carts', {
    method: 'POST',
    body: cartData,
  }),
  update: (id, cartData) => apiRequest(`/api/carts/${id}`, {
    method: 'PUT',
    body: cartData,
  }),
  clearCart: (userId) => apiRequest(`/api/carts/user/${userId}/clear`, {
    method: 'DELETE',
  }),
  getTotal: (userId) => apiRequest(`/api/carts/user/${userId}/total`),
  delete: (id) => apiRequest(`/api/carts/${id}`, {
    method: 'DELETE',
  }),
};
export const cartItemsAPI = {
  getAll: () => apiRequest('/api/cart-items'),
  getById: (id) => apiRequest(`/api/cart-items/${id}`),
  addToCart: (itemData) => apiRequest('/api/carts/items/add', {
    method: 'POST',
    body: itemData,
  }),
  updateQuantity: (userId, productId, quantityData) => apiRequest(`/api/carts/items/user/${userId}/product/${productId}/quantity`, {
    method: 'PUT',
    body: quantityData,
  }),
  removeFromCart: (userId, productId) => apiRequest(`/api/carts/items/user/${userId}/product/${productId}`, {
    method: 'DELETE',
  }),
  getByCartId: (cartId) => apiRequest(`/api/carts/items/cart/${cartId}`),
  create: (itemData) => apiRequest('/api/cart-items', {
    method: 'POST',
    body: itemData,
  }),
  update: (id, itemData) => apiRequest(`/api/cart-items/${id}`, {
    method: 'PUT',
    body: itemData,
  }),
  delete: (id) => apiRequest(`/api/cart-items/${id}`, {
    method: 'DELETE',
  }),
};
export const createOrder = async (orderData) => {
  try {
    console.log('Enviando datos de orden:', orderData);
    const response = await apiRequest('/api/orders', {
      method: 'POST',
      body: {
        usuario_id: orderData.usuario_id || orderData.usuarioId,
        total: orderData.total,
        estado: orderData.estado || 'pendiente',
        productos: orderData.items || orderData.productos || []
      }
    });
    console.log('Orden creada exitosamente:', response);
    return response;
  } catch (error) {
    console.error('Error al crear orden:', error);
    throw error;
  }
};
export default {
  BASE_URL,
  usuariosAPI,
  productosAPI,
  categoriasAPI,
  ordenesAPI,
  orderItemsAPI,
  pagosAPI,
  tiposTarjetaAPI,
  estadosOrdenAPI,
  initializeTestData,
  checkBackendConnection,
  cartAPI,
  cartItemsAPI,
};

