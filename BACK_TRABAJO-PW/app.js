import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './src/routes/productRoutes.js';
import productCategoryRoutes from './src/routes/productCategoryRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import './src/models/index.js'; 
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
    return res.json({ result: 'BACKEND TIENDITA ONLINE - FUNCIONA CORRECTAMENTE ✅'})
});
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', productCategoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
export default app;
