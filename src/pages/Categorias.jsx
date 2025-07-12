import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import SafeImage from '../components/ui/SafeImage';
import { categoriasAPI } from '../services/api';
import '../styles/pages/Categorias.css';
function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    cargarCategorias();
  }, []);
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriasData = await categoriasAPI.getAll();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('Error al cargar las categorías. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  const filteredCategorias = categorias.filter(categoria =>
    categoria && categoria.nombre && categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return (
      <div>
        <Header />
        <NavBar />
        <main className="main-content">
          <div className="container">
            <div className="loading-message">
              <p>Cargando categorías...</p>
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
              <button onClick={cargarCategorias} className="retry-btn">
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
            <h1>🏷️ Todas las Categorías</h1>
            <p className="subtitle">Explora nuestras categorías de productos organizadas para ti</p>
            <div className="stats-info">
              <span className="categories-count">
                <i className="fa fa-list"></i>
                {categorias.length} categorías disponibles
              </span>
            </div>
          </div>
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <i className="fa fa-search search-icon"></i>
            </div>
            {searchTerm && (
              <div className="search-results-info">
                Mostrando {filteredCategorias.length} de {categorias.length} categorías
              </div>
            )}
          </div>
          <div className="categories-grid">
            {filteredCategorias.map(categoria => (
              <div key={categoria.id} className="category-card">
                <div className="category-image">
                  <SafeImage 
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    fallbackSrc="/images/image.png"
                  />
                  <div className="category-overlay">
                    <div className="category-icon">
                      <i className="fa fa-boxes"></i>
                    </div>
                  </div>
                </div>
                <div className="category-info">
                  <h3>{categoria.nombre}</h3>
                  <p className="category-description">{categoria.descripcion}</p>
                  <div className="category-actions">
                    <Link 
                      to={`/buscar?categoria=${categoria.id}`} 
                      className="btn btn-primary"
                    >
                      <i className="fa fa-eye"></i>
                      Ver Productos
                    </Link>
                    <div className="category-stats">
                      <span className="products-hint">
                        <i className="fa fa-box"></i>
                        Productos disponibles
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCategorias.length === 0 && searchTerm && (
            <div className="no-results">
              <div className="no-results-icon">
                <i className="fa fa-search"></i>
              </div>
              <h3>No se encontraron categorías</h3>
              <p>No encontramos categorías que coincidan con <strong>"{searchTerm}"</strong></p>
              <div className="suggestions">
                <p>Intenta con:</p>
                <ul>
                  <li>Palabras más cortas</li>
                  <li>Términos más generales</li>
                  <li>Revisar la ortografía</li>
                </ul>
              </div>
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary"
              >
                <i className="fa fa-refresh"></i>
                Ver todas las categorías
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default Categorias;

