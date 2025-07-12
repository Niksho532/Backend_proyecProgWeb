import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import '../../styles/components/shopping/Checkout.css';
const Checkout = () => {
  const navigate = useNavigate();
  const { cart, isLoading } = useCart();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    ciudad: '',
    departamento: '',
    direccion: '',
    codigoPostal: '',
    telefono: ''
  });
  const safeCart = cart || [];
  const subtotal = safeCart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const delivery = 0;
  const descuentos = 0;
  const total = subtotal - descuentos + delivery;
  if (isLoading) {
    return (
      <div className="checkout-page">
        <Header />
        <NavBar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Cargando...
        </div>
        <Footer />
      </div>
    );
  }
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ['nombre', 'apellido', 'ciudad', 'departamento', 'direccion', 'telefono'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    if (emptyFields.length > 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    localStorage.setItem('shippingData', JSON.stringify(formData));
    navigate('/pago');
  };
  return (
    <div className="checkout-page">
      <Header />
      <NavBar />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Finalizar Compra</h1>
          <div className="checkout-steps">
            <div className="step active">
              <span className="step-number">1</span>
              <span className="step-title">Dirección</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span className="step-title">Pago</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span className="step-title">Confirmación</span>
            </div>
          </div>
        </div>
        <div className="checkout-content">
          <form className="direccion-envio" onSubmit={handleSubmit}>
            <h2>Dirección de envío</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu apellido"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad *</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu ciudad"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="departamento">Departamento *</label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu departamento"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ingresa tu dirección completa"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigoPostal">Código postal</label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleInputChange}
                  placeholder="Código postal"
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono de contacto *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Número de teléfono"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/carrito')} className="btn-secondary">
                Volver al carrito
              </button>
              <button type="submit" className="btn-primary">
                Continuar al pago
              </button>
            </div>
          </form>
          <div className="resumen-compra">
            <h2>Resumen de la compra</h2>
            <div className="cart-items">
              {safeCart.map(item => (
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
                <span>Productos ({safeCart.length})</span>
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
export default Checkout;

