import React, { useState, useEffect } from 'react';
import '../../styles/components/payment/PagoQR.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { getCurrentUser } from '../../services/auth';
import { requireAuth, debugAuthState } from '../../utils/authHelpers';
import { ordenesAPI } from '../../services/api';
const PagoQR = () => {
  const navigate = useNavigate();
  const { cart: cartItems, getCartTotal, clearCart, createOrderFromCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    debugAuthState('PagoQR mount');
    if (!requireAuth(navigate, '/login', '/pago/qr')) {
      return;
    }
  }, [navigate]);
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      debugAuthState('PagoQR auth state change');
      if (!requireAuth(navigate, '/login', '/pago/qr')) {
        return;
      }
    }
  }, [isAuthenticated, authLoading, navigate]);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const total = getCartTotal();
  const deliveryFee = total >= 50 ? 0 : 8;
  const finalTotal = total + deliveryFee;
  const handlePagoCompletado = async () => {
    try {
      setLoading(true);
      console.log('Starting payment process...');
      console.log('Cart items:', cartItems);
      const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
      console.log('Shipping data:', shippingData);
      const currentUser = JSON.parse(localStorage.getItem('usuario') || localStorage.getItem('currentUser') || '{}');
      console.log('Current user:', currentUser);
      if (!currentUser.id) {
        throw new Error('Usuario no encontrado. Por favor, inicia sesión.');
      }
      const orderData = {
        direccionEnvio: shippingData,
        metodoPago: 'QR',
        deliveryFee
      };
      console.log('Creating order with data:', orderData);
      const nuevaOrden = await createOrderFromCart(orderData);
      console.log('Order created successfully:', nuevaOrden);
      localStorage.setItem('ultimaOrden', JSON.stringify({
        ...nuevaOrden,
        items: cartItems,
        metodoPago: 'QR',
        direccionEnvio: shippingData
      }));
      navigate('/orden-completada');
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert(`Error al procesar el pago: ${error.message}. Por favor, intenta nuevamente.`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pago-container">
      <h1>Checkout</h1>
      <div className="pago-content">
        <div className="qr-box">
          <h2>Escanear QR</h2>
          <img
            className="qr-img"
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Mi-Tiendita-Pago-QR"
            alt="Código QR"
          />
          <p className="validez">Válido por {formatTime(timeLeft)} minutos</p>
          <p className="instrucciones">
            Escanea este código QR con tu aplicación de pago preferida para completar la compra.
          </p>
          <button
            className="btn-pagar"
            onClick={handlePagoCompletado}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Ya realicé el pago'}
          </button>
        </div>
        <div className="resumen-compra">
          <h2>Resumen de la compra</h2>
          <div className="productos-resumen">
            {(cartItems || []).map(item => (
              <div key={item.id} className="producto-item">
                <span>{item.nombre} x{item.quantity}</span>
                <span>S/ {(item.precio * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="totales">
            <p>Productos ({(cartItems || []).reduce((sum, item) => sum + item.quantity, 0)}) - S/ {total.toFixed(2)}</p>
            <p>Delivery - {deliveryFee === 0 ? 'GRATIS' : `S/ ${deliveryFee.toFixed(2)}`}</p>
            <p>Descuentos - S/ 0.00</p>
            <hr />
            <p className="total-final">Total: S/ {finalTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PagoQR;

