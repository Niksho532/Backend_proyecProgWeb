import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { createOrder, cartAPI, cartItemsAPI } from '../services/api';
import { getCurrentUser } from '../services/auth';
const CartContext = createContext();
const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};
const getCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error al cargar carrito desde localStorage:', error);
    return [];
  }
};
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar carrito en localStorage:', error);
  }
};
const cartReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case ACTIONS.LOAD_CART:
      return action.payload;
    case ACTIONS.ADD_TO_CART:
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        newState = state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newState = [...state, { ...action.payload, quantity: 1 }];
      }
      break;
    case ACTIONS.REMOVE_FROM_CART:
      newState = state.filter(item => item.id !== action.payload);
      break;
    case ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) {
        newState = state.filter(item => item.id !== action.payload.id);
      } else {
        newState = state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;
    case ACTIONS.CLEAR_CART:
      newState = [];
      break;
    default:
      return state;
  }
  const currentUser = getCurrentUser();
  if (!currentUser?.id) {
    saveCartToStorage(newState);
  }
  return newState;
};
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isLoading, setIsLoading] = useState(true);
  const [userCartId, setUserCartId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncWithBackend = async () => {
    try {
      if (isSyncing) {
        console.log('⏳ Sync already in progress, skipping...');
        return false;
      }
      const currentUser = getCurrentUser();
      if (!currentUser?.id) {
        console.log('No user logged in, using localStorage only');
        return false;
      }
      setIsSyncing(true);
      console.log('🔄 Syncing cart with backend for user:', currentUser.id);
      let userCart;
      try {
        userCart = await cartAPI.getCartByUser(parseInt(currentUser.id));
        console.log('✅ Found existing cart:', userCart);
      } catch (error) {
        console.log('📝 No existing cart found, creating new one');
        userCart = await cartAPI.create({
          usuario_id: parseInt(currentUser.id),
          total: 0
        });
        console.log('✅ Created new cart:', userCart);
      }
      setUserCartId(userCart.id);
      try {
        const cartItems = await cartItemsAPI.getByCartId(userCart.id);
        console.log('📦 Backend cart items:', cartItems);
        if (!cartItems || cartItems.length === 0) {
          console.log('📭 No items in backend cart');
          dispatch({ type: ACTIONS.LOAD_CART, payload: [] });
          return true;
        }
        const formattedItems = cartItems.map(item => {
          const productInfo = item.Product || item.product || {};
          const productId = parseInt(item.producto_id || item.product_id || item.productId || 0);
          const quantity = parseInt(item.cantidad || item.quantity || 1);
          const precio = parseFloat(item.precio_unitario || item.precioUnitario || productInfo.precio || 0);
          return {
            id: productId || Math.random().toString(36).substr(2, 9),
            nombre: productInfo.nombre || `Producto ${item.producto_id || item.product_id || 'Unknown'}`,
            precio: precio || 0,
            imagen: productInfo.imagen || '/images/default.jpg',
            categoria: productInfo.categoria || 'General',
            quantity: quantity || 1
          };
        });
        console.log('🎯 Formatted cart items:', formattedItems);
        dispatch({ type: ACTIONS.LOAD_CART, payload: formattedItems });
        return true;
      } catch (itemsError) {
        console.error('❌ Error fetching cart items:', itemsError);
        dispatch({ type: ACTIONS.LOAD_CART, payload: [] });
        return false;
      }
    } catch (error) {
      console.error('❌ Error syncing with backend:', error);
      const savedCart = getCartFromStorage();
      console.log('🔄 Falling back to localStorage cart:', savedCart);
      dispatch({ type: ACTIONS.LOAD_CART, payload: savedCart });
      return false;
    } finally {
      setIsSyncing(false);
    }
  };
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      const currentUser = getCurrentUser();
      console.log('Loading cart - Current user:', currentUser);
      if (currentUser?.id) {
        console.log('User authenticated, loading from backend');
        await syncWithBackend();
      } else {
        console.log('User not authenticated, loading from localStorage');
        const savedCart = getCartFromStorage();
        dispatch({ type: ACTIONS.LOAD_CART, payload: savedCart });
      }
      setIsLoading(false);
    };
    loadCart();
    const handleAuthChange = async () => {
      console.log('Auth change detected in CartContext, reloading cart');
      const currentUser = getCurrentUser();
      if (currentUser?.id) {
        await syncWithBackend();
      } else {
        const savedCart = getCartFromStorage();
        dispatch({ type: ACTIONS.LOAD_CART, payload: savedCart });
      }
    };
    const interval = setInterval(async () => {
      const currentUser = getCurrentUser();
      if (currentUser?.id && !userCartId && !isSyncing) {
        console.log('User authenticated but no cart loaded, syncing...');
        await syncWithBackend();
      }
    }, 3000);
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);
  const syncItemWithBackend = async (item, action = 'add') => {
    try {
      const currentUser = getCurrentUser();
      console.log('🔍 getCurrentUser() returned:', currentUser);
      console.log('🔍 Context currentUser state:', getCurrentUser());
      console.log('🔍 userCartId:', userCartId);
      if (!currentUser?.id || !userCartId) {
        console.log('⚠️ No user or cart ID, skipping backend sync');
        console.log('🔍 currentUser?.id:', currentUser?.id);
        console.log('🔍 userCartId:', userCartId);
        return;
      }
      console.log(`🔄 Syncing ${action} action with backend:`, item);
      switch (action) {
        case 'add':
        case 'update':
          const payload = {
            userId: parseInt(currentUser.id),
            productId: parseInt(item.id),
            quantity: parseInt(item.quantity)
          };
          console.log('🔍 Sending to backend:', payload);
          console.log('🔍 Original currentUser.id:', currentUser.id, typeof currentUser.id);
          console.log('🔍 Original item.id:', item.id, typeof item.id);
          console.log('🔍 Original item.quantity:', item.quantity, typeof item.quantity);
          const result = await cartItemsAPI.addToCart(payload);
          console.log('✅ Backend sync successful:', result);
          break;
        case 'remove':
          await cartItemsAPI.removeFromCart(parseInt(currentUser.id), parseInt(item.id));
          console.log('✅ Item removed from backend');
          break;
        case 'clear':
          await cartAPI.clearCart(parseInt(currentUser.id));
          console.log('✅ Cart cleared in backend');
          break;
      }
      try {
        const total = cart.reduce((sum, cartItem) => sum + (cartItem.precio * cartItem.quantity), 0);
        await cartAPI.update(userCartId, { total });
        console.log('✅ Cart total updated in backend:', total);
      } catch (totalError) {
        console.warn('⚠️ Failed to update cart total:', totalError.message);
      }
    } catch (error) {
      console.error('❌ Error syncing with backend:', error);
    }
  };
  const addToCart = async (product) => {
    console.log('Adding to cart:', product);
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
    const existingItem = cart.find(item => item.id === product.id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
    await syncItemWithBackend({ ...product, quantity: newQuantity }, 'add');
  };
  const removeFromCart = async (productId) => {
    console.log('Removing from cart:', productId);
    const itemToRemove = cart.find(item => item.id === productId);
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
    if (itemToRemove) {
      await syncItemWithBackend(itemToRemove, 'remove');
    }
  };
  const updateQuantity = async (productId, quantity) => {
    console.log('Updating quantity:', productId, quantity);
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
    const item = cart.find(item => item.id === productId);
    if (item) {
      await syncItemWithBackend({ ...item, quantity }, 'update');
    }
  };
  const clearCart = async () => {
    console.log('Clearing cart');
    dispatch({ type: ACTIONS.CLEAR_CART });
    await syncItemWithBackend(null, 'clear');
  };
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  const createOrderFromCart = async (orderData) => {
    try {
      const currentUser = getCurrentUser();
      console.log('Creating order - Current user:', currentUser);
      if (!currentUser || !currentUser.id) {
        console.error('No user found or user missing ID');
        throw new Error('Debes iniciar sesión para realizar una compra');
      }
      if (!cart || cart.length === 0) {
        throw new Error('El carrito está vacío');
      }
      const orderPayload = {
        usuario_id: currentUser.id,
        usuarioId: currentUser.id,
        total: getCartTotal(),
        estado: 'pendiente',
        ...orderData,
        items: cart.map(item => ({
          producto_id: item.id,
          id: item.id,
          nombre: item.nombre,
          categoria: item.categoria || 'General',
          cantidad: item.quantity,
          quantity: item.quantity,
          precio: item.precio,
          precio_unitario: item.precio
        }))
      };
      console.log('Creando orden con datos completos:', orderPayload);
      const response = await createOrder(orderPayload);
      console.log('Orden creada exitosamente:', response);
      await clearCart();
      return response;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error;
    }
  };
  const refreshCart = async () => {
    await syncWithBackend();
  };
  const value = {
    cart: cart || [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    createOrderFromCart,
    refreshCart,
    syncWithBackend,
    isLoading,
    userCartId
  };
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};
export default CartContext;

