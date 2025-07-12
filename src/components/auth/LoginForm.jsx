import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GiConcentrationOrb } from "react-icons/gi";
import { SiIconfinder } from "react-icons/si";
import Footer from '../layout/Footer'; 
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
import { usuariosAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components/auth/LoginForm.css';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/';
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const credentials = {
        correo: email,
        contrasena: password
      };
      const response = await usuariosAPI.login(credentials);
      const loginSuccess = login(response.user);
      if (loginSuccess) {
        if (response.user.tipo === 'admin') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError('Error al procesar el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='login-page'>
      <Header />
      <NavBar />
      <div className='login-container'>
        <div className='wrapper'>
          <form onSubmit={handleSubmit}>
            <h1>Iniciar Sesión</h1>
            <div className='input-box'>
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                placeholder="usuario@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='input-box'>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Recuérdame
              </label>
              <Link to="/restablecer">¿Olvidaste tu contraseña?</Link>
            </div>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            <div className="register-link">
              <p>¿No tienes una cuenta? <Link to="/registro">Regístrate</Link></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default LoginForm;

