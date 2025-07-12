﻿import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuariosAPI } from '../../services/api';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import '../../styles/components/auth/RestablecerContraseña.css';
const RestablecerContraseña = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      setLoading(false);
      return;
    }
    try {

      const response = await usuariosAPI.login({ 
        email: email, 
        password: 'dummy' 
      });

      setError('Email verificado. Ahora ingresa tu nueva contraseña.');
      setLoading(false);
    } catch (error) {
      if (error.message.includes('Usuario no encontrado')) {
        setError('No se encontró una cuenta asociada a este correo electrónico.');
        setLoading(false);
        return;
      }

      if (error.message.includes('Contraseña incorrecta')) {
        setStep(2);
        setLoading(false);
        return;
      }
      setError('Error verificando el email. Intenta de nuevo.');
      setLoading(false);
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!newPassword || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }
    try {
      await usuariosAPI.resetPassword({
        email: email,
        newPassword: newPassword
      });
      setStep(3);
      setLoading(false);
    } catch (error) {
      setError('Error al restablecer la contraseña. Intenta de nuevo.');
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="restablecer-container">
          <div className="restablecer-card">
            <div className="success-icon">✅</div>
            <h2>¡Contraseña restablecida!</h2>
            <p>
              Tu contraseña ha sido cambiada exitosamente.
            </p>
            <p>
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <div className="restablecer-actions">
              <Link to="/login" className="btn-volver">
                Ir al login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }


  if (step === 2) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="restablecer-container">
          <div className="restablecer-card">
            <div className="restablecer-header">
              <h2>🔑 Nueva Contraseña</h2>
              <p>Ingresa tu nueva contraseña para <strong>{email}</strong></p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="restablecer-form">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
              <button 
                type="submit" 
                className="btn-restablecer"
                disabled={loading}
              >
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </form>
            <div className="restablecer-footer">
              <button 
                type="button" 
                className="btn-back"
                onClick={() => setStep(1)}
              >
                ← Volver
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <NavBar />
      <div className="restablecer-container">
        <div className="restablecer-card">
          <div className="restablecer-header">
            <h2>🔐 Restablecer Contraseña</h2>
            <p>Ingresa tu correo electrónico para restablecer tu contraseña.</p>
          </div>
          <form onSubmit={handleEmailSubmit} className="restablecer-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn-restablecer"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
          <div className="restablecer-footer">
            <p>
              ¿Recordaste tu contraseña? 
              <Link to="/login"> Volver al login</Link>
            </p>
            <p>
              ¿No tienes cuenta? 
              <Link to="/registro"> Crear cuenta</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default RestablecerContraseña;

