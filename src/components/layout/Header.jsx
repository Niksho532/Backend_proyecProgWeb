import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components/layout/Header.css';
function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query)}`);
    }
  };
  const getTotalItems = () => {
    return cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h1>Mi-Tiendita <span className="dot">•</span></h1>
          </Link>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar un producto..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
        <div className="user-actions">
          <button className="btn-cart" onClick={() => navigate('/carrito')}>
            <i className="fa fa-shopping-cart"></i>
            CARRITO
            {getTotalItems() > 0 && <span className="cart-count">{getTotalItems()}</span>}
          </button>
          {isAuthenticated && user ? (
            <div className="user-menu">
              <button className="btn-user" onClick={() => navigate('/mis-ordenes')}>
                <i className="fa fa-user"></i>
                {user.nombre?.toUpperCase() || user.nombres?.toUpperCase() || 'USUARIO'}
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fa fa-sign-out-alt"></i>
                CERRAR SESIÓN
              </button>
            </div>
          ) : (
            <button className="btn-user" onClick={() => navigate('/login')}>
              <i className="fa fa-user"></i>
              INICIAR SESIÓN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;

