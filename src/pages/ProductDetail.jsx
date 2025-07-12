import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { productosAPI } from '../services/api';
import '../styles/pages/ProductDetail.css';
function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  useEffect(() => {
    cargarProducto();
  }, [id]);
  const cargarProducto = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productosAPI.getById(id);
      setProduct(productData);
      const allProducts = await productosAPI.getAll();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error cargando producto:', error);
      setError('Error al cargar el producto. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return (
    <div className="product-loading">
      <Header />
      <NavBar />
      <div className="container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando producto...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
  if (error || !product) return (
    <div className="product-not-found">
      <Header />
      <NavBar />
      <div className="container">
        <div className="not-found-content">
          <h2>{error ? 'Error' : 'Producto no encontrado'}</h2>
          <p>{error || 'El producto que buscas no existe o ha sido eliminado.'}</p>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
  const similarProducts = products
    .filter(p => p.categoria === product.categoria && p.id !== product.id)
    .slice(0, 5);
  return (
    <>
      <Header />
      <NavBar />
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link> &gt; 
          <Link to={`/buscar?categoria=${product.categoria}`}>
            {product.categoria}
          </Link> &gt;
          <span>{product.nombre}</span>
        </div>
        <div className="product-detail-card">
          <div className="product-detail-left">
            <img src={product.imagen} alt={product.nombre} className="product-detail-image" />
          </div>
          <div className="product-detail-right">
            <h1 className="product-detail-title">{product.nombre}</h1>
            <div className="product-detail-divider"></div>
            <div className="product-detail-specs">
              <p className="product-presentation">Presentación {product.presentacion}</p>
              <p className="product-description">{product.descripcion}</p>
            </div>
            <div className="product-detail-price">
              <span className="price-label">s/ {product.precio} {product.unidad}</span>
              <button className="add-cart-btn" onClick={() => addToCart(product)}>
                <i className="fa fa-shopping-cart"></i> AGREGAR
              </button>
            </div>
          </div>
        </div>
        {similarProducts.length > 0 && (
          <div className="similar-products-section">
            <h3 className="section-title">Productos similares</h3>
            <div className="similar-products-carousel">
              <button className="carousel-control prev">
                <i className="fa fa-chevron-left"></i>
              </button>
              <div className="similar-products-list">
                {similarProducts.map(p => (
                  <div key={p.id} className="similar-product-item">
                    <Link to={`/producto/${p.id}`} className="product-image">
                      <img src={p.imagen} alt={p.nombre} />
                    </Link>
                    <div className="similar-product-info">
                      <Link to={`/producto/${p.id}`}>
                        <h4>{p.nombre}</h4>
                      </Link>
                      <p className="product-category">{p.categoria}</p>
                      <p className="similar-product-price">S/ {p.precio} {p.unidad}</p>
                      <button className="add-to-cart-btn" onClick={() => addToCart(p)}>
                        AGREGAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-control next">
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
export default ProductDetail;

