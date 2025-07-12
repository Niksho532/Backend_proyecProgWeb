import express from 'express';
import CartItemController from '../controllers/cartItemController.js';
const router = express.Router();
router.post('/add', CartItemController.addToCart);
router.get('/cart/:cartId', CartItemController.getByCartId);
router.put('/user/:userId/product/:productId/quantity', CartItemController.updateQuantity);
router.delete('/user/:userId/product/:productId', CartItemController.removeFromCart);
export default router;

