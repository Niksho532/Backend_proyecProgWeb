import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
function ProductList({ products, title }) {
  const { addToCart } = useCart();
  const scrollContainerRef = useRef(null);
  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      nombre: product.name || product.nombre,
      precio: product.price || product.precio,
      imagen: product.image || product.imagen,
      quantity: 1
    });
  };
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -220,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 220,
        behavior: 'smooth'
      });
    }
  };
  return (
    <section className="products-section">
      {title && <h2>{title}</h2>}
      <div className="products-carousel">
        <button className="carousel-control prev" onClick={scrollLeft}>
          <i className="fa fa-chevron-left"></i>
        </button>
        <div className="product-list" ref={scrollContainerRef}>
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/producto/${product.id}`}>
                <img 
                  src={product.image || product.imagen} 
                  alt={product.name || product.nombre}
                  className="product-image"
                />
              </Link>
              <div className="product-info">
                <Link to={`/producto/${product.id}`}>
                  <h3 className="product-title">{product.name || product.nombre}</h3>
                </Link>
                <p className="product-description">{product.description || product.descripcion}</p>
                <p className="product-price">S/{product.price || product.precio}</p>
                <button 
                  className="btn-add-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  AGREGAR
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control next" onClick={scrollRight}>
          <i className="fa fa-chevron-right"></i>
        </button>
      </div>
    </section>
  )
}
export default ProductList

