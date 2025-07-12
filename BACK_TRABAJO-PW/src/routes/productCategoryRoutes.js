import express from 'express';
import productCategoryController from '../controllers/productCategoryController.js';
const router = express.Router();
router.get('/', productCategoryController.findAll);
router.get('/:id', productCategoryController.findOne);
export default router;

