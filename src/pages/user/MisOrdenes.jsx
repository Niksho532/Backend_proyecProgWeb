import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import { ordenesAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import '../../styles/components/user/MisOrdenes.css';
const MisOrdenes = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [usuario, setUsuario] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadUserData();
  }, [navigate]);
  const loadUserData = async () => {
    try {
      setLoading(true);
      const usuarioLogueado = await getCurrentUser();
      if (!usuarioLogueado) {
        navigate('/login');
        return;
      }
      setUsuario(usuarioLogueado);
      
      const ordenesUsuario = await ordenesAPI.getByUser(usuarioLogueado.id);
      console.log('📦 Órdenes recibidas:', ordenesUsuario);
      
      const ordenesArray = Array.isArray(ordenesUsuario) ? ordenesUsuario : [];
      setOrdenes(ordenesArray);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pagado':
        return '#28a745';
      case 'Pendiente':
        return '#ffc107';
      case 'Cancelado':
        return '#dc3545';
      case 'Entregado':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };
  const handleRecomprar = async (orden) => {
    try {
      if (orden.productos && orden.productos.length > 0) {
        
        for (const producto of orden.productos) {
          const productData = {
            id: producto.product_id || producto.id,
            nombre: producto.nombre || producto.Product?.nombre,
            precio: producto.precio || producto.Product?.precio,
            imagen: producto.imagen || producto.Product?.imagen,
            quantity: parseInt(producto.quantity || producto.cantidad || 1)
          };
          
          const quantity = parseInt(producto.quantity || producto.cantidad || 1);
          for (let i = 0; i < quantity; i++) {
            await addToCart(productData);
          }
        }
        
        alert('Productos añadidos al carrito exitosamente');
        
        navigate('/carrito');
      } else {
        alert('No se pueden recomprar productos de esta orden');
      }
    } catch (error) {
      console.error('Error al recomprar:', error);
      alert('Error al añadir productos al carrito');
    }
  };
  if (loading) {
    return (
      <div className="mis-ordenes-container">
        <div className="loading-estado">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }
  if (!usuario) {
    return (
      <div className="mis-ordenes-container">
        <div className="loading-estado">
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mis-ordenes-container">
      <div className="mis-ordenes-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
          Volver al Inicio
        </button>
        <h1>Mis Órdenes</h1>
        <p>Historial completo de tus compras</p>
      </div>
      <div className="ordenes-content">
        {ordenes.length === 0 ? (
          <div className="ordenes-vacias">
            <div className="icono-vacio">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <h2>No tienes órdenes aún</h2>
            <p>Cuando realices tu primera compra, aparecerá aquí</p>
            <button 
              className="btn-empezar-compras"
              onClick={() => navigate('/')}
            >
              Empezar a Comprar
            </button>
          </div>
        ) : (
          <div className="ordenes-lista">
            {ordenes.map(orden => (
              <div key={orden.id} className="orden-card">
                <div className="orden-header">
                  <div className="orden-info">
                    <h3>Orden #{orden.id}</h3>
                    <p className="fecha">
                      {orden.fecha 
                        ? new Date(orden.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Fecha no disponible'
                      }
                    </p>
                  </div>
                  <div className="orden-estado">
                    <span 
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(orden.estado) }}
                    >
                      {orden.estado}
                    </span>
                  </div>
                </div>
                <div className="orden-productos">
                  {orden.productos && orden.productos.length > 0 ? (
                    orden.productos.map(producto => (
                      <div key={producto.product_id || producto.id} className="producto-orden">
                        <div className="producto-imagen-container">
                          {producto.imagen || producto.Product?.imagen ? (
                            <img 
                              src={producto.imagen || producto.Product?.imagen} 
                              alt={producto.nombre || 'Producto'}
                              className="producto-imagen-mini"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="producto-imagen-placeholder" style={{
                            display: (producto.imagen || producto.Product?.imagen) ? 'none' : 'flex'
                          }}>
                            <i className="fas fa-box"></i>
                          </div>
                        </div>
                        <div className="producto-info">
                          <span className="producto-nombre">{producto.nombre || producto.Product?.nombre || 'Producto sin nombre'}</span>
                          <span className="producto-cantidad">Cantidad: {producto.quantity || producto.cantidad || 1}</span>
                        </div>
                        <span className="producto-precio">
                          S/ {(parseFloat(producto.precio || producto.Product?.precio || '0') * parseInt(producto.quantity || producto.cantidad || '1')).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="sin-productos">No hay productos en esta orden</div>
                  )}
                </div>
                <div className="orden-footer">
                  <div className="orden-total">
                    <span>Total: S/ {parseFloat(orden.total || '0').toFixed(2)}</span>
                  </div>
                  <div className="orden-acciones">
                    <button 
                      className="btn-ver-detalle"
                      onClick={() => navigate(`/orden-detalle/${orden.id}`)}
                    >
                      <i className="fas fa-eye"></i>
                      Ver Detalle
                    </button>
                    {orden.estado === 'Entregado' && (
                      <button 
                        className="btn-recomprar"
                        onClick={() => handleRecomprar(orden)}
                      >
                        <i className="fas fa-redo-alt"></i>
                        Volver a Comprar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MisOrdenes;

