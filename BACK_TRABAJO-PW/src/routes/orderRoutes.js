import express from 'express';
import OrderController from '../controllers/orderController.js';
const router = express.Router();
router.post('/', OrderController.createOrder);
router.get('/user/:userId', OrderController.getOrdersByUser);
router.get('/:id/details', OrderController.getOrderDetails);
router.get('/:id', OrderController.getOrderById);
export default router;

