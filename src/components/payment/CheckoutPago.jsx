import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getCurrentUser } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';
import { requireAuth, debugAuthState } from '../../utils/authHelpers';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import '../../styles/components/payment/CheckoutPago.css';
const CheckoutPago = () => {
  const navigate = useNavigate();
  const { cart: cartItems, createOrderFromCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    debugAuthState('CheckoutPago mount');
    if (!requireAuth(navigate, '/login', '/pago')) {
      return;
    }
  }, [navigate]);
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      debugAuthState('CheckoutPago auth state change');
      if (!requireAuth(navigate, '/login', '/pago')) {
        return;
      }
    }
  }, [isAuthenticated, authLoading, navigate]);
  const subtotal = (cartItems || []).reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const delivery = 0;
  const descuentos = 0;
  const total = subtotal - descuentos + delivery;
  const handleCashOnDelivery = async () => {
    console.log('=== CASH ON DELIVERY HANDLER START ===');
    if (!requireAuth(navigate, '/login', '/pago')) {
      return;
    }
    const currentUser = user || getCurrentUser();
    debugAuthState('handleCashOnDelivery');
    if (!currentUser || !currentUser.id) {
      console.error('❌ User validation failed:', currentUser);
      alert('Error con los datos del usuario. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    console.log('✅ Proceeding with cash on delivery for user:', currentUser);
    setLoading(true);
    try {
      const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
      const orderData = {
        direccionEnvio: shippingData,
        metodoPago: 'Pago contra entrega'
      };
      const nuevaOrden = await createOrderFromCart(orderData);
      localStorage.setItem('ultimaOrden', JSON.stringify({
        ...nuevaOrden,
        items: cartItems,
        metodoPago: 'Pago contra entrega',
        direccionEnvio: shippingData
      }));
      console.log('✅ Order created successfully, navigating to completion');
      navigate('/orden-completada');
    } catch (error) {
      console.error('❌ Error creando orden:', error);
      alert('Error al procesar la orden. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pago-page">
      <Header />
      <NavBar />
      <div className="pago-container">
        <div className="pago-header">
          <h1>Método de Pago</h1>
          <div className="checkout-steps">
            <div className="step completed">
              <span className="step-number">1</span>
              <span className="step-title">Dirección</span>
            </div>
            <div className="step active">
              <span className="step-number">2</span>
              <span className="step-title">Pago</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-title">Confirmación</span>
            </div>
          </div>
        </div>
        <div className="pago-content">
          <div className="metodo-pago">
            <h2>Selecciona tu método de pago</h2>
            <div className="payment-methods">
              <div className="payment-option" onClick={() => navigate('/pago/tarjeta')}>
                <div className="payment-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="payment-info">
                  <h3>Tarjeta de débito/crédito</h3>
                  <p>Visa, Mastercard, American Express</p>
                </div>
                <div className="payment-logos">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" />
                </div>
              </div>
              <div className="payment-option" onClick={() => navigate('/pago/qr')}>
                <div className="payment-icon">
                  <i className="fas fa-qrcode"></i>
                </div>
                <div className="payment-info">
                  <h3>Pago con QR</h3>
                  <p>Escanea el código QR desde tu app móvil</p>
                </div>
                <div className="qr-preview">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Mi-Tiendita-Payment"
                    alt="QR Preview"
                  />
                </div>
              </div>
              <div className="payment-option" onClick={handleCashOnDelivery}>
                <div className="payment-icon">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <div className="payment-info">
                  <h3>Pago contra entrega</h3>
                  <p>Paga en efectivo al recibir tu pedido</p>
                </div>
                <div className="payment-badge">
                  <span>{loading ? 'Procesando...' : 'Disponible'}</span>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/checkout')} 
                className="btn-secondary"
              >
                Volver
              </button>
            </div>
          </div>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CheckoutPago;

