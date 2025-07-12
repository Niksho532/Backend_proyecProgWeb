import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import '../../styles/components/shopping/OrdenCompletada.css';
const OrdenCompletada = () => {
  const navigate = useNavigate();
  const ultimaOrden = JSON.parse(localStorage.getItem('ultimaOrden') || '{}');
  const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
  React.useEffect(() => {
    if (!ultimaOrden.id) {
      navigate('/');
    } else {
      const cleanupTimer = setTimeout(() => {
        localStorage.removeItem('ultimaOrden');
        localStorage.removeItem('shippingData');
      }, 30000);
      return () => clearTimeout(cleanupTimer);
    }
  }, [ultimaOrden, navigate]);
  if (!ultimaOrden.id) {
    return null;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const total = ultimaOrden.total ? parseFloat(ultimaOrden.total.replace('S/', '')) : 0;
  const productos = ultimaOrden.productos || [];
  const subtotal = productos.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const deliveryFee = subtotal >= 50 ? 0 : 8;
  return (
    <div className="orden-page">
      <Header />
      <NavBar />
      <div className="orden-container">
        <div className="orden-header">
          <div className="success-animation">
            <div className="checkmark-circle">
              <i className="fas fa-check"></i>
            </div>
          </div>
          <h1>¡Compra Exitosa!</h1>
          <p className="success-message">Tu pedido ha sido procesado exitosamente</p>
        </div>
        <div className="orden-content">
          <div className="orden-details">
            <div className="order-info-card">
              <h2>Detalles de la orden</h2>
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="label">Número de orden:</span>
                  <span className="value">#{ultimaOrden.id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Fecha de compra:</span>
                  <span className="value">{formatDate(ultimaOrden.createdAt)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Método de pago:</span>
                  <span className="value">Pago QR</span>
                </div>
                <div className="info-item">
                  <span className="label">Estado:</span>
                  <span className="value status-completed">Completada</span>
                </div>
              </div>
            </div>
            <div className="productos-card">
              <h2>Productos comprados</h2>
              <div className="productos-list">
                {productos.map(item => (
                  <div key={item.id} className="producto-item">
                    <img src={item.imagen || '/images/products/default-product.png'} alt={item.nombre} />
                    <div className="producto-info">
                      <h4>{item.nombre}</h4>
                      <p>Cantidad: {item.quantity}</p>
                      <p className="precio">S/ {(item.precio * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {shippingData.direccion && (
              <div className="direccion-card">
                <h2>Dirección de envío</h2>
                <div className="direccion-info">
                  <p><strong>{shippingData.nombre} {shippingData.apellido}</strong></p>
                  <p>{shippingData.direccion}</p>
                  <p>{shippingData.ciudad}, {shippingData.departamento}</p>
                  {shippingData.codigoPostal && <p>CP: {shippingData.codigoPostal}</p>}
                  <p>Tel: {shippingData.telefono}</p>
                </div>
                <div className="shipping-status">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Tu pedido está siendo preparado para el envío</span>
                </div>
              </div>
            )}
          </div>
          <div className="orden-sidebar">
            <div className="resumen-card">
              <h3>Resumen de la compra</h3>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Productos ({productos.length})</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "free" : ""}>
                    {deliveryFee === 0 ? 'GRATIS' : `S/ ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="price-row">
                  <span>Descuentos</span>
                  <span>- S/ 0.00</span>
                </div>
                <hr />
                <div className="price-row total">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="next-steps-card">
              <h3>¿Qué sigue?</h3>
              <div className="steps-list">
                <div className="step-item">
                  <i className="fas fa-box"></i>
                  <div>
                    <h4>Preparación</h4>
                    <p>Estamos preparando tu pedido</p>
                  </div>
                </div>
                <div className="step-item">
                  <i className="fas fa-truck"></i>
                  <div>
                    <h4>Envío</h4>
                    <p>Te notificaremos cuando salga</p>
                  </div>
                </div>
                <div className="step-item">
                  <i className="fas fa-home"></i>
                  <div>
                    <h4>Entrega</h4>
                    <p>Recibirás tu pedido en 2-3 días</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-home"></i>
                Regresar al Menú
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/mis-ordenes')}
              >
                <i className="fas fa-receipt"></i>
                Ver mis pedidos
              </button>
            </div>
          </div>
        </div>
        <div className="thank-you-section">
          <div className="thank-you-content">
            <h2>¡Gracias por confiar en Mi-Tiendita!</h2>
            <p>Tu satisfacción es nuestra prioridad. Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+51 999 888 777</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>soporte@mi-tiendita.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default OrdenCompletada;

