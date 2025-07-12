import CartItem from '../models/cartItem.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import User from '../models/user.js';
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        console.log('🛒 Añadiendo al carrito:', { userId, productId, quantity });
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ 
                message: 'userId, productId y quantity son requeridos' 
            });
        }
        let cart = await Cart.findOne({
            where: { usuarioId: parseInt(userId), estado: 'activo' }
        });
        if (!cart) {
            cart = await Cart.create({ 
                usuarioId: parseInt(userId), 
                estado: 'activo' 
            });
            console.log('✅ Carrito creado:', cart.id);
        }
        const product = await Product.findByPk(parseInt(productId));
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        let cartItem = await CartItem.findOne({
            where: { 
                cartId: cart.id, 
                productId: parseInt(productId) 
            }
        });
        if (cartItem) {
            cartItem.quantity = parseInt(quantity);
            await cartItem.save();
            console.log('✅ Item actualizado:', cartItem.toJSON());
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId: parseInt(productId),
                quantity: parseInt(quantity),
                precioUnitario: parseFloat(product.precio)
            });
            console.log('✅ Item creado:', cartItem.toJSON());
        }
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [Product]
        });
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.precioUnitario) * item.quantity);
        }, 0);
        await cart.update({ total: total.toFixed(2) });
        return res.status(200).json({
            message: 'Producto añadido al carrito exitosamente',
            cartItem,
            cartTotal: total.toFixed(2)
        });
    } catch (error) {
        console.error('❌ Error añadiendo al carrito:', error);
        return res.status(500).json({ message: error.message });
    }
};
const getByCartId = async (req, res) => {
    try {
        const { cartId } = req.params;
        const cartItems = await CartItem.findAll({
            where: { cartId: parseInt(cartId) },
            include: [
                {
                    model: Product,
                    attributes: ['nombre', 'categoria', 'precio', 'imagen', 'stock']
                }
            ]
        });
        return res.status(200).json(cartItems);
    } catch (error) {
        console.error('❌ Error obteniendo items del carrito:', error);
        return res.status(500).json({ message: error.message });
    }
};
const updateQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        console.log('🔄 Actualizando cantidad:', { userId, productId, quantity });
        const cart = await Cart.findOne({
            where: { usuarioId: parseInt(userId), estado: 'activo' }
        });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const cartItem = await CartItem.findOne({
            where: { 
                cartId: cart.id, 
                productId: parseInt(productId) 
            }
        });
        if (!cartItem) {
            return res.status(404).json({ message: 'Item no encontrado en el carrito' });
        }
        cartItem.quantity = parseInt(quantity);
        await cartItem.save();
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [Product]
        });
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.precioUnitario) * item.quantity);
        }, 0);
        await cart.update({ total: total.toFixed(2) });
        return res.status(200).json({
            message: 'Cantidad actualizada exitosamente',
            cartItem,
            cartTotal: total.toFixed(2)
        });
    } catch (error) {
        console.error('❌ Error actualizando cantidad:', error);
        return res.status(500).json({ message: error.message });
    }
};
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        console.log('🗑️ Eliminando del carrito:', { userId, productId });
        const cart = await Cart.findOne({
            where: { usuarioId: parseInt(userId), estado: 'activo' }
        });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const deletedRows = await CartItem.destroy({
            where: { 
                cartId: cart.id, 
                productId: parseInt(productId) 
            }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Item no encontrado en el carrito' });
        }
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [Product]
        });
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.precioUnitario) * item.quantity);
        }, 0);
        await cart.update({ total: total.toFixed(2) });
        return res.status(200).json({
            message: 'Producto eliminado del carrito exitosamente',
            cartTotal: total.toFixed(2)
        });
    } catch (error) {
        console.error('❌ Error eliminando del carrito:', error);
        return res.status(500).json({ message: error.message });
    }
};
export default {
    addToCart,
    getByCartId,
    updateQuantity,
    removeFromCart
};

