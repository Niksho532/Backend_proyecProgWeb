import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import { useCart } from '../context/CartContext'
import { productosAPI, categoriasAPI } from '../services/api'
import '../styles/pages/SearchResults.css'
function useQuery() {
  return new URLSearchParams(useLocation().search)
}
function SearchResults() {
  const query = useQuery()
  const searchTerm = query.get('q') || ''
  const categoriaParam = query.get('categoria') || ''
  const [order, setOrder] = useState('nombre')
  const [category, setCategory] = useState(categoriaParam)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()
  useEffect(() => {
    cargarDatos();
  }, []);
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productosData, categoriasData] = await Promise.all([
        productosAPI.getAll(),
        categoriasAPI.getAll()
      ]);
      setProducts(productosData);
      setCategories(categoriasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  let filtered = products.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  if (category) {
    const categoryObj = categories.find(cat => cat.id === category);
    if (categoryObj) {
      filtered = filtered.filter(p => p.categoria === categoryObj.nombre);
    }
  }
  if (order === 'precio') {
    filtered.sort((a, b) => a.precio - b.precio)
  } else {
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }
  if (loading) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando productos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (error) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            <p>{error}</p>
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
      <div className="container">
        <div className="search-results-content">
          <div className="search-header">
            <h2 className="search-title">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los productos'}
              <span className="results-count">({filtered.length} productos encontrados)</span>
            </h2>
            <div className="filter-options">
              <div className="filter-group">
                <label>
                  Ordenar por:
                  <select value={order} onChange={e => setOrder(e.target.value)}>
                    <option value="nombre">Nombre</option>
                    <option value="precio">Precio</option>
                  </select>
                </label>
              </div>
              <div className="filter-group">
                <label>
                  Categoría:
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Todas</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="product-grid">
            {filtered.length > 0 ? (
              filtered.map(product => (
                <div key={product.id} className="product-card">
                  <Link to={`/producto/${product.id}`} className="product-link">
                    <img src={product.imagen} alt={product.nombre} />
                    <h3>{product.nombre}</h3>
                    <p className="product-category">{product.categoria}</p>
                    <p className="price">S/ {product.precio} {product.unidad}</p>
                  </Link>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>No se encontraron productos que coincidan con tu búsqueda "{searchTerm}"</p>
                <Link to="/" className="btn-primary">Volver al inicio</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default SearchResults
