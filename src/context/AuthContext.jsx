import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);
  const login = (email, password) => {
    const mockUser = {
      id: 1,
      email: email,
      nombre: 'Usuario',
      apellido: 'Demo',
      tipo: 'cliente'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return mockUser;
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };
  const register = (userData) => {
    const newUser = {
      id: Date.now(),
      email: userData.email,
      nombre: userData.nombres,
      apellido: userData.apellidos,
      tipo: 'cliente'
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  };
  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
export default AuthContext;

