import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
function CategoryList({ categories }) {
  const scrollContainerRef = useRef(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -180,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 180,
        behavior: 'smooth'
      });
    }
  };
  return (
    <div className="category-section">
      <h2>Explora las categorías</h2>
      <div className="category-carousel">
        <button className="carousel-control prev" onClick={scrollLeft}>
          <i className="fa fa-chevron-left"></i>
        </button>
        <div className="category-list" ref={scrollContainerRef}>
          {categories.map((category) => (
            <Link key={category.id} to={`/buscar?categoria=${category.id}`} className="category-item">
              <div className="category-icon">
                <img src={category.image || category.imagen} alt={category.name || category.nombre} />
              </div>
              <h3>{category.name || category.nombre}</h3>
            </Link>
          ))}
        </div>
        <button className="carousel-control next" onClick={scrollRight}>
          <i className="fa fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
}
export default CategoryList

