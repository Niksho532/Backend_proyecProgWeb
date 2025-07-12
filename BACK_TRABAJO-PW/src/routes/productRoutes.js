import express from 'express';
import ProductController from '../controllers/productController.js';
const router = express.Router();
router.get('/', ProductController.findAll);
router.get('/category/:category', ProductController.findByCategory);
router.get('/:id', ProductController.findOne);
export default router;

