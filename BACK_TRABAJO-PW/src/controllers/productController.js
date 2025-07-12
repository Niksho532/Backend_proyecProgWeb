import Product from '../models/product.js';
import ProductCategory from '../models/productCategory.js';
import ProductService from '../services/productService.js';
const findByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await ProductService.findByCategory(category);
        const result = products.map(product => ({
            id: product.id,
            categoria: product.ProductCategory ? product.ProductCategory.nombre : product.categoria,
            nombre: product.nombre,
            precio: product.precio,
            unidad: product.unidad,
            imagen: product.imagen,
            presentacion: product.presentacion,
            marca: product.marca,
            origen: product.origen,
            stock: product.stock,
            priceUSD: product.priceUSD,
            pricePEN: product.pricePEN,
            descripcion: product.descripcion
        }));
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const findAll = async (req, res) => {
    try {
        const results = await ProductService.findAll();
        const products = results.map((product) => ({
            id: product.id,
            nombre: product.nombre,
            categoria: product.ProductCategory ? product.ProductCategory.nombre : product.categoria,
            precio: product.precio,
            unidad: product.unidad,
            imagen: product.imagen,
            presentacion: product.presentacion,
            marca: product.marca,
            origen: product.origen,
            stock: product.stock,
            priceUSD: product.priceUSD,
            pricePEN: product.pricePEN,
            descripcion: product.descripcion,
            category_id: product.category_id
        }));
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductService.findOne(id);
        if (!result) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const product = {
            id: result.id,
            nombre: result.nombre,
            categoria: result.ProductCategory ? result.ProductCategory.nombre : result.categoria,
            precio: result.precio,
            unidad: result.unidad,
            imagen: result.imagen,
            presentacion: result.presentacion,
            marca: result.marca,
            origen: result.origen,
            stock: result.stock,
            priceUSD: result.priceUSD,
            pricePEN: result.pricePEN,
            descripcion: result.descripcion,
            category_id: result.category_id
        };
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export default { findAll, findOne, findByCategory };

