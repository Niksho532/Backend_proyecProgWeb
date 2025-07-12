import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { getCurrentUser } from '../../services/auth';
import { requireAuth, debugAuthState } from '../../utils/authHelpers';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import { ordenesAPI } from '../../services/api';
import '../../styles/components/payment/PagoTarjeta.css';
const PagoTarjeta = () => {
  const navigate = useNavigate();
  const { cart: cartItems, clearCart, createOrderFromCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    numeroTarjeta: '',
    nombre: '',
    fechaExpiracion: '',
    cvc: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    debugAuthState('PagoTarjeta mount');
    if (!requireAuth(navigate, '/login', '/pago/tarjeta')) {
      return;
    }
  }, [navigate]);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      debugAuthState('PagoTarjeta auth state change');
      if (!requireAuth(navigate, '/login', '/pago/tarjeta')) {
        return;
      }
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  useEffect(() => {
    if (!cartLoading && (!cartItems || cartItems.length === 0)) {
      alert('Tu carrito está vacío. Serás redirigido a la tienda.');
      navigate('/productos');
    }
  }, [cartItems, cartLoading, navigate]);
  const subtotal = (cartItems || []).reduce((sum, item) => {
    const precio = Number(item.precio || item.precioUnitario || 0);
    return sum + (precio * item.quantity);
  }, 0);
  const delivery = 0;
  const descuentos = 0;
  const total = subtotal - descuentos + delivery;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'numeroTarjeta') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    if (name === 'fechaExpiracion') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 3) formattedValue = formattedValue.slice(0, 3);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.numeroTarjeta || formData.numeroTarjeta.replace(/\s/g, '').length < 16) {
      newErrors.numeroTarjeta = 'Número de tarjeta inválido';
    }
    if (!formData.nombre || formData.nombre.length < 3) {
      newErrors.nombre = 'Nombre completo requerido';
    }
    if (!formData.fechaExpiracion || formData.fechaExpiracion.length < 5) {
      newErrors.fechaExpiracion = 'Fecha de expiración inválida';
    }
    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'CVC inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        
        if (!cartItems || cartItems.length === 0) {
          alert('Tu carrito está vacío. No se puede procesar la compra.');
          return;
        }
        
        if (!currentUser || !currentUser.id) {
          alert('Debes estar logueado para realizar una compra. Serás redirigido al login.');
          navigate('/login');
          return;
        }
        
        const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
        
        const orderData = {
          direccionEnvio: shippingData,
          metodoPago: 'Tarjeta',
          tarjeta: `**** **** **** ${formData.numeroTarjeta.slice(-4)}`,
          tipoTarjeta: getCardType()
        };
        
        const nuevaOrden = await createOrderFromCart(orderData);
        
        localStorage.setItem('ultimaOrden', JSON.stringify({
          ...nuevaOrden,
          items: cartItems,
          metodoPago: 'Tarjeta',
          tarjeta: `**** **** **** ${formData.numeroTarjeta.slice(-4)}`,
          tipoTarjeta: getCardType(),
          direccionEnvio: shippingData
        }));
        
        navigate('/orden-completada', { 
          state: { 
            orderData: nuevaOrden,
            paymentMethod: 'Tarjeta',
            cardInfo: `**** **** **** ${formData.numeroTarjeta.slice(-4)}`
          } 
        });
      } catch (error) {
        console.error('Error procesando pago:', error);
        alert(`Error al procesar el pago: ${error.message}. Por favor, intenta nuevamente.`);
      } finally {
        setLoading(false);
      }
    }
  };
  const getCardType = () => {
    const number = formData.numeroTarjeta.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    return 'generic';
  };
  return (
    <div className="pago-page">
      <Header />
      <NavBar />
      <div className="pago-container">
        <div className="pago-header">
          <h1>Pago con Tarjeta</h1>
          <div className="checkout-steps">
            <div className="step completed">
              <span className="step-number">1</span>
              <span className="step-title">Dirección</span>
            </div>
            <div className="step completed">
              <span className="step-number">2</span>
              <span className="step-title">Pago</span>
            </div>
            <div className="step active">
              <span className="step-number">3</span>
              <span className="step-title">Confirmación</span>
            </div>
          </div>
        </div>
        <div className="pago-content">
          <form className="form-tarjeta" onSubmit={handleSubmit}>
            <h2>Información de la tarjeta</h2>
            <div className="tarjeta-visual">
              <div className={`tarjeta-card ${getCardType()}`}>
                <div className="tarjeta-chip"></div>
                <div className="tarjeta-number">
                  {formData.numeroTarjeta || '**** **** **** ****'}
                </div>
                <div className="tarjeta-info">
                  <div className="tarjeta-holder">
                    <span className="label">CARDHOLDER</span>
                    <span className="value">{formData.nombre || 'NOMBRE COMPLETO'}</span>
                  </div>
                  <div className="tarjeta-expires">
                    <span className="label">EXPIRES</span>
                    <span className="value">{formData.fechaExpiracion || 'MM/YY'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="numeroTarjeta">Número de la tarjeta *</label>
              <input
                type="text"
                id="numeroTarjeta"
                name="numeroTarjeta"
                value={formData.numeroTarjeta}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={errors.numeroTarjeta ? 'error' : ''}
                required
              />
              {errors.numeroTarjeta && <span className="error-message">{errors.numeroTarjeta}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del titular *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre completo como aparece en la tarjeta"
                className={errors.nombre ? 'error' : ''}
                required
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaExpiracion">Fecha de expiración *</label>
                <input
                  type="text"
                  id="fechaExpiracion"
                  name="fechaExpiracion"
                  value={formData.fechaExpiracion}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={errors.fechaExpiracion ? 'error' : ''}
                  required
                />
                {errors.fechaExpiracion && <span className="error-message">{errors.fechaExpiracion}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="cvc">CVC *</label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={errors.cvc ? 'error' : ''}
                  required
                />
                {errors.cvc && <span className="error-message">{errors.cvc}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/pago')} 
                className="btn-secondary"
              >
                Volver
              </button>
              <button type="submit" className="btn-pagar" disabled={loading}>
                <i className="fas fa-lock"></i> {loading ? 'Procesando...' : `Pagar S/ ${total.toFixed(2)}`}
              </button>
            </div>
          </form>
          <div className="resumen-compra">
            <h2>Resumen de la compra</h2>
            <div className="cart-items">
              {(cartItems || []).map(item => (
                <div key={item.id} className="cart-item-summary">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="item-details">
                    <h4>{item.nombre}</h4>
                    <p>Cantidad: {item.quantity}</p>
                    <p className="item-price">S/ {(item.precio * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Productos ({(cartItems || []).length})</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery</span>
                <span className="free">GRATIS</span>
              </div>
              <div className="price-row">
                <span>Descuentos</span>
                <span>- S/ {descuentos.toFixed(2)}</span>
              </div>
              <hr />
              <div className="price-row total">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="security-info">
              <div className="security-item">
                <i className="fas fa-shield-alt"></i>
                <span>Transacción segura</span>
              </div>
              <div className="security-item">
                <i className="fas fa-lock"></i>
                <span>Datos encriptados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default PagoTarjeta;

