import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import NavBar from '../components/layout/NavBar';
import Banner from '../components/layout/Banner';
import CategoryList from '../components/products/CategoryList';
import ProductList from '../components/products/ProductList';
import Footer from '../components/layout/Footer';
import { categoriasAPI, productosAPI } from '../services/api';
function Home() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    cargarDatos();
  }, []);
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriasData = await categoriasAPI.getAll();
      setCategorias(categoriasData.slice(0, 6));
      const productosData = await productosAPI.getAll();
      setProductos(productosData);
      setProductosMasVendidos(productosData.slice(0, 8));
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="app">
      <Header />
      <NavBar />
      <main className="main-content">
        <Banner />
        {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Cargando...</div>}
        {error && <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>}
        {!loading && !error && (
          <>
            <CategoryList categories={categorias} />
            <ProductList 
              products={productosMasVendidos} 
              title="Lo más vendido" 
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
export default Home;
