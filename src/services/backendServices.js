import { categoriasAPI, productosAPI, usuariosAPI, ventasAPI, ordenesAPI } from './api';
export const getCategorias = async () => {
  try {
    const response = await categoriasAPI.getAll();
    return response || [];
  } catch (error) {
    console.error('Error obteniendo categorías del backend:', error);
    return [];
  }
};
export const saveCategorias = async (categorias) => {
  console.warn('saveCategorias: Usar categoriasAPI.create() o categoriasAPI.update() directamente');
  return categorias;
};
export const getProductos = async () => {
  try {
    const response = await productosAPI.getAll();
    return response || [];
  } catch (error) {
    console.error('Error obteniendo productos del backend:', error);
    return [];
  }
};
export const saveProductos = async (productos) => {
  console.warn('saveProductos: Usar productosAPI.create() o productosAPI.update() directamente');
  return productos;
};
export const getProductosPorCategoria = async (categoria) => {
  try {
    const productos = await getProductos();
    return productos.filter(producto => 
      producto.categoria?.toLowerCase() === categoria?.toLowerCase()
    );
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    return [];
  }
};
export const getProductoPorId = async (id) => {
  try {
    const response = await productosAPI.getById(id);
    return response;
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error);
    return null;
  }
};
export const getUsuarios = async () => {
  try {
    const response = await usuariosAPI.getAll();
    return response || [];
  } catch (error) {
    console.error('Error obteniendo usuarios del backend:', error);
    return [];
  }
};
export const saveUsuarios = async (usuarios) => {
  console.warn('saveUsuarios: Usar usuariosAPI.create() o usuariosAPI.update() directamente');
  return usuarios;
};
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
};
export const login = (usuario) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    return usuario;
  } catch (error) {
    console.error('Error guardando usuario en login:', error);
    return null;
  }
};
export const logout = () => {
  try {
    localStorage.removeItem('currentUser');
    return true;
  } catch (error) {
    console.error('Error en logout:', error);
    return false;
  }
};
export const getOrdenes = async () => {
  try {
    const response = await ordenesAPI.getAll();
    return response || [];
  } catch (error) {
    console.error('Error obteniendo órdenes del backend:', error);
    return [];
  }
};
export const saveOrdenes = async (ordenes) => {
  console.warn('saveOrdenes: Usar ordenesAPI.create() o ordenesAPI.update() directamente');
  return ordenes;
};
export const getOrdenesByUsuarioId = async (usuarioId) => {
  try {
    const ordenes = await getOrdenes();
    return ordenes.filter(orden => orden.usuario_id === usuarioId || orden.usuario === usuarioId);
  } catch (error) {
    console.error('Error obteniendo órdenes por usuario:', error);
    return [];
  }
};
export const getProductosMasVendidos = async () => {
  try {
    const productos = await productosAPI.getAll();
    return productos.slice(0, 8) || [];
  } catch (error) {
    console.error('Error obteniendo productos más vendidos del backend:', error);
    return [];
  }
};
export const getEstadisticas = async () => {
  try {
    const [usuarios, ordenes] = await Promise.all([
      usuariosAPI.getAll(),
      ordenesAPI.getAll()
    ]);
    const totalUsuarios = usuarios?.length || 0;
    const totalOrdenes = ordenes?.length || 0;
    let ingresosTotales = 0;
    if (ordenes && Array.isArray(ordenes)) {
      ingresosTotales = ordenes.reduce((total, orden) => {
        const precio = parseFloat(orden.total) || 0;
        return total + precio;
      }, 0);
    }
    return {
      ordenes: totalOrdenes,
      usuariosNuevos: Math.floor(totalUsuarios * 0.2),
      ingresosTotales: `S/${ingresosTotales.toFixed(2)}`
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas del backend:', error);
    return {
      ordenes: 0,
      usuariosNuevos: 0,
      ingresosTotales: 'S/0.00'
    };
  }
};
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
export const initializeLocalStorage = () => {
  console.warn('⚠️ DEPRECATED: initializeLocalStorage() - Los datos ahora se obtienen del backend API');
};
export const forceReinitializeLocalStorage = () => {
  console.warn('⚠️ DEPRECATED: forceReinitializeLocalStorage() - Los datos ahora vienen del backend');
};
export default {
  getCategorias,
  saveCategorias,
  getProductos,
  saveProductos,
  getProductosPorCategoria,
  getProductoPorId,
  getUsuarios,
  saveUsuarios,
  getCurrentUser,
  login,
  logout,
  getOrdenes,
  saveOrdenes,
  getOrdenesByUsuarioId,
  getProductosMasVendidos,
  getEstadisticas,
  generateId,
  initializeLocalStorage,
  forceReinitializeLocalStorage
};

