import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/globals/App.css';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import Productos from './pages/Productos';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import LoginForm from './components/auth/LoginForm';
import RegistroForm from './components/auth/RegistroForm';
import RestablecerContraseña from './components/auth/RestablecerContraseña';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ComprasCarrito from './components/shopping/ComprasCarrito';
import Checkout from './components/shopping/Checkout';
import OrdenCompletada from './components/shopping/OrdenCompletada';
import CheckoutPago from './components/payment/CheckoutPago';
import PagoQR from './components/payment/PagoQR';
import PagoTarjeta from './components/payment/PagoTarjeta';
import MisOrdenes from './pages/user/MisOrdenes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
          {}
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          {}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<RegistroForm />} />
          <Route path="/restablecer" element={<RestablecerContraseña />} />
          {}
          <Route path="/carrito" element={<ComprasCarrito />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/pago" element={
            <ProtectedRoute>
              <CheckoutPago />
            </ProtectedRoute>
          } />
          <Route path="/pago/qr" element={
            <ProtectedRoute>
              <PagoQR />
            </ProtectedRoute>
          } />
          <Route path="/pago/tarjeta" element={
            <ProtectedRoute>
              <PagoTarjeta />
            </ProtectedRoute>
          } />
          <Route path="/orden-completada" element={
            <ProtectedRoute>
              <OrdenCompletada />
            </ProtectedRoute>
          } />
          {}
          <Route path="/mis-ordenes" element={
            <ProtectedRoute>
              <MisOrdenes />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  );
}
export default App;

