import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuariosAPI } from '../../services/api';
import '../../styles/components/auth/RegistroForm.css';
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
const RegistroForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El email no es válido';
    }
    if (!formData.contraseña) {
      nuevosErrores.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 6) {
      nuevosErrores.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!formData.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = 'Confirma tu contraseña';
    } else if (formData.contraseña !== formData.confirmarContraseña) {
      nuevosErrores.confirmarContraseña = 'Las contraseñas no coinciden';
    }
    if (formData.dni && !/^\d{8}$/.test(formData.dni)) {
      nuevosErrores.dni = 'El DNI debe tener 8 dígitos';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setLoading(true);
    setErrores({});
    setMensaje('');
    try {
      const userData = {
        nombres: formData.nombre,
        apellidos: formData.apellido,
        correo: formData.email,
        contrasena: formData.contraseña,
        nroDocumento: formData.dni,
        telefono: formData.telefono,
        tipo: 'cliente'
      };
      const registerResponse = await usuariosAPI.register(userData);
      setMensaje('Registro exitoso. Iniciando sesión...');
      const loginCredentials = {
        correo: formData.email,
        contrasena: formData.contraseña
      };
      const loginResponse = await usuariosAPI.login(loginCredentials);
      localStorage.setItem('usuario', JSON.stringify(loginResponse.user));
      setMensaje('¡Bienvenido! Redirigiendo...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.message.includes('email') || error.message.includes('correo')) {
        setErrores({ email: 'Este email ya está registrado' });
      } else if (error.message.includes('documento')) {
        setErrores({ dni: 'Este DNI ya está registrado' });
      } else {
        setErrores({ general: error.message || 'Error al registrar usuario' });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="registro-page">
      <Header />
      <NavBar />
      <div className="registro-container">
        <div className="registro-form-wrapper">
          <form onSubmit={handleRegister}>
            <h2>Crear Cuenta</h2>
            <p>Únete a Mi-Tiendita y disfruta de nuestros productos</p>
            {mensaje && (
              <div className="mensaje-exito">
                <i className="fas fa-check-circle"></i>
                {mensaje}
              </div>
            )}
            {errores.general && (
              <div className="mensaje-error">
                <i className="fas fa-exclamation-circle"></i>
                {errores.general}
              </div>
            )}
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errores.nombre ? 'error' : ''}
                  disabled={loading}
                />
                {errores.nombre && <span className="error-message">{errores.nombre}</span>}
              </div>
              <div className="form-group half">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={errores.apellido ? 'error' : ''}
                  disabled={loading}
                />
                {errores.apellido && <span className="error-message">{errores.apellido}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="usuario@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errores.email ? 'error' : ''}
                  disabled={loading}
                />
                {errores.email && <span className="error-message">{errores.email}</span>}
              </div>
              <div className="form-group half">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="999 999 999"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                placeholder="12345678"
                value={formData.dni}
                onChange={handleInputChange}
                className={errores.dni ? 'error' : ''}
                maxLength="8"
                disabled={loading}
              />
              {errores.dni && <span className="error-message">{errores.dni}</span>}
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="contraseña">Contraseña *</label>
                <input
                  type="password"
                  id="contraseña"
                  name="contraseña"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.contraseña}
                  onChange={handleInputChange}
                  className={errores.contraseña ? 'error' : ''}
                  disabled={loading}
                />
                {errores.contraseña && <span className="error-message">{errores.contraseña}</span>}
              </div>
              <div className="form-group half">
                <label htmlFor="confirmarContraseña">Confirmar Contraseña *</label>
                <input
                  type="password"
                  id="confirmarContraseña"
                  name="confirmarContraseña"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleInputChange}
                  className={errores.confirmarContraseña ? 'error' : ''}
                  disabled={loading}
                />
                {errores.confirmarContraseña && <span className="error-message">{errores.confirmarContraseña}</span>}
              </div>
            </div>
            <button type="submit" className="btn-registro" disabled={loading}>
              <i className="fas fa-user-plus"></i>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
            <div className="login-link">
              <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default RegistroForm;

