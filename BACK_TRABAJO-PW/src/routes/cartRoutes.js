import express from 'express';
import CartController from '../controllers/cartController.js';
const router = express.Router();
router.get('/user/:userId', CartController.getCartByUser);
router.get('/user/:userId/total', CartController.getCartTotal);
router.delete('/user/:userId/clear', CartController.clearCart);
router.post('/items/add', CartController.addToCart);
router.get('/items/cart/:cartId', CartController.getCartItems);
router.put('/items/user/:userId/product/:productId/quantity', CartController.updateCartItemQuantity);
router.delete('/items/user/:userId/product/:productId', CartController.removeCartItem);
router.get('/:id', CartController.findOne);
router.post('/', CartController.create);
router.put('/:id', CartController.update);
router.delete('/:id', CartController.remove);
export default router;

