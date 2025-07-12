import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import NavBar from '../layout/NavBar';
import Footer from '../layout/Footer';
import '../../styles/components/shopping/ComprasCarrito.css';
import { useCart } from '../../context/CartContext';
const ComprasCarrito = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const subtotal = (cart || []).reduce((sum, item) => sum + (Number(item.precio || 0) * item.quantity), 0);
  const envio = 0;
  const total = subtotal + envio;
  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    navigate('/checkout');
  };
  return (
    <>
      <Header />
      <NavBar />
      <div className="carrito-container">
        <div className="carrito-header">
          <h1>🛒 Mi Carrito de Compras</h1>
          <div className="carrito-nav">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Inicio</span>
            <span> / </span>
            <span>Carrito</span>
          </div>
        </div>
        <div className="carrito-contenido">
          <div className="carrito-productos">
            {(!cart || cart.length === 0) ? (
              <div className="carrito-vacio">
                <div className="carrito-vacio-icon">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p>Agrega algunos productos para comenzar tu compra</p>
                <button 
                  onClick={() => navigate('/')}
                  className="btn-seguir-comprando"
                >
                  Seguir Comprando
                </button>
              </div>
            ) : (
              <>
                <div className="productos-header">
                  <h2>Productos ({cart.length})</h2>
                  <button 
                    onClick={clearCart}
                    className="btn-limpiar-carrito"
                  >
                    Limpiar Carrito
                  </button>
                </div>
                {cart.map(item => (
                  <div key={item.id} className="producto-carrito">
                    <div className="producto-imagen">
                      <img 
                        src={item.imagen || '/images/products/default.png'} 
                        alt={item.nombre}
                        onError={(e) => {
                          e.target.src = '/images/products/default.png';
                        }}
                      />
                    </div>
                    <div className="producto-info">
                      <h3 className="producto-nombre">{item.nombre}</h3>
                      <p className="producto-descripcion">{item.descripcion}</p>
                      <p className="producto-precio">S/. {Number(item.precio || 0).toFixed(2)}</p>
                    </div>
                    <div className="producto-controles">
                      <div className="cantidad-controles">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="btn-cantidad"
                        >
                          -
                        </button>
                        <span className="cantidad-numero">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="btn-cantidad"
                        >
                          +
                        </button>
                      </div>
                      <div className="producto-total">
                        S/. {(Number(item.precio || 0) * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn-eliminar"
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          {cart && cart.length > 0 && (
            <div className="carrito-resumen">
              <div className="resumen-card">
                <h3>Resumen de Compra</h3>
                <div className="resumen-linea">
                  <span>Productos ({cart.length})</span>
                  <span>S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="resumen-linea">
                  <span>Envío</span>
                  <span className="envio-gratis">GRATIS</span>
                </div>
                <div className="resumen-linea descuento">
                  <span>Descuentos</span>
                  <span>-S/. 0.00</span>
                </div>
                <div className="resumen-total">
                  <span>Total</span>
                  <span>S/. {total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="btn-checkout"
                >
                  Proceder al Checkout
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="btn-seguir-comprando-mini"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default ComprasCarrito;
  
