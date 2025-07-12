import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import SafeImage from '../components/ui/SafeImage';
import { useCart } from '../context/CartContext';
import { productosAPI } from '../services/api';
import '../styles/pages/Productos.css';
import '../styles/pages/Categorias.css';
import '../styles/globals/ImageFix.css';
function Productos() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('nombre');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  useEffect(() => {
    cargarProductos();
  }, []);
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const productosData = await productosAPI.getAll();
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  const filteredProductos = productos.filter(producto =>
    producto && producto.nombre && producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto && producto.marca && producto.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedProductos = [...filteredProductos].sort((a, b) => {
    if (order === 'precio') {
      return parseFloat(a.precio || 0) - parseFloat(b.precio || 0);
    } else {
      return (a.nombre || '').localeCompare(b.nombre || '');
    }
  });
  const handleAddToCart = (producto) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      quantity: 1
    });
  };
  if (loading) {
    return (
      <div>
        <Header />
        <NavBar />
        <main className="main-content">
          <div className="container">
            <div className="loading-message">
              <p>Cargando productos...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <Header />
        <NavBar />
        <main className="main-content">
          <div className="container">
            <div className="error-message">
              <p>{error}</p>
              <button onClick={cargarProductos} className="retry-btn">
                Reintentar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div>
      <Header />
      <NavBar />
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>🛍️ Todos los Productos</h1>
            <p className="subtitle">Descubre nuestra amplia variedad de productos frescos y de calidad</p>
            <div className="stats-info">
              <span className="products-count">
                <i className="fa fa-box"></i>
                {productos.length} productos disponibles
              </span>
            </div>
          </div>
          <div className="search-and-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar productos por nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <i className="fa fa-search search-icon"></i>
            </div>
            <div className="filter-options">
              <div className="filter-group">
                <label>
                  <i className="fa fa-sort"></i>
                  Ordenar por:
                  <select value={order} onChange={e => setOrder(e.target.value)}>
                    <option value="nombre">📝 Nombre</option>
                    <option value="precio">💰 Precio</option>
                  </select>
                </label>
              </div>
              <div className="results-info">
                Mostrando {sortedProductos.length} de {productos.length} productos
              </div>
            </div>
          </div>
          <div className="products-grid">
            {sortedProductos.map(producto => (
              <div key={producto.id} className="product-card">
                <Link to={`/producto/${producto.id}`} className="product-link">
                  <div className="product-image">
                    <SafeImage 
                      src={producto.imagen} 
                      alt={producto.nombre}
                      fallbackSrc="/images/image.png"
                    />
                    <div className="quick-view-overlay">
                      <i className="fa fa-eye"></i>
                      <span>Ver detalles</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 title={producto.nombre}>{producto.nombre}</h3>
                    <div className="product-meta">
                      <span className="product-category">
                        <i className="fa fa-tag"></i>
                        {producto.categoria}
                      </span>
                      <span className="product-unit">
                        <i className="fa fa-balance-scale"></i>
                        por {producto.unidad}
                      </span>
                    </div>
                    <div className="price-container">
                      <span className="product-price">S/ {parseFloat(producto.precio).toFixed(2)}</span>
                      <span className="price-per-unit">por {producto.unidad}</span>
                    </div>
                  </div>
                </Link>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(producto)}
                  title="Agregar al carrito"
                >
                  <i className="fa fa-cart-plus"></i>
                  <span>Agregar</span>
                </button>
              </div>
            ))}
          </div>
          {sortedProductos.length === 0 && searchTerm && (
            <div className="no-results">
              <div className="no-results-icon">
                <i className="fa fa-search"></i>
              </div>
              <h3>No se encontraron productos</h3>
              <p>No encontramos productos que coincidan con <strong>"{searchTerm}"</strong></p>
              <div className="suggestions">
                <p>Intenta con:</p>
                <ul>
                  <li>Palabras más cortas o generales</li>
                  <li>Revisar la ortografía</li>
                  <li>Usar sinónimos</li>
                </ul>
              </div>
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary"
              >
                <i className="fa fa-refresh"></i>
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default Productos;

