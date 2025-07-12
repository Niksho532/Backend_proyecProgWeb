export const getCurrentUser = () => {
  try {
    let userData = localStorage.getItem('currentUser') || localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
};
export const login = (usuario) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    localStorage.setItem('usuario', JSON.stringify(usuario)); 
    return usuario;
  } catch (error) {
    console.error('Error guardando usuario en login:', error);
    return null;
  }
};
export const logout = () => {
  try {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('usuario'); 
    return true;
  } catch (error) {
    console.error('Error en logout:', error);
    return false;
  }
};
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
export const ensureTestUser = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    const testUser = {
      id: 6, 
      email: 'test@test.com',
      nombre: 'Usuario',
      apellido: 'Test',
      tipo: 'cliente'
    };
    login(testUser);
    return testUser;
  }
  return currentUser;
};
export const createTestUser = () => {
  const testUser = {
    id: 2,
    email: 'user@test.com',
    nombre: 'Usuario',
    apellido: 'Test',
    tipo: 'cliente'
  };
  login(testUser);
  return testUser;
};

