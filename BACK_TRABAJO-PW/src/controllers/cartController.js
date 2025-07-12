import CartService from '../services/cartService.js';
const findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await CartService.findOne(id);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getCartByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await CartService.findByUserId(userId);
        const subtotal = cart.CartItems ? cart.CartItems.reduce((total, item) => {
            return total + (parseFloat(item.precioUnitario) * item.quantity);
        }, 0) : 0;
        const cartWithTotals = {
            ...cart.toJSON(),
            subtotal: subtotal.toFixed(2),
            itemCount: cart.CartItems ? cart.CartItems.length : 0,
            totalItems: cart.CartItems ? cart.CartItems.reduce((sum, item) => sum + item.quantity, 0) : 0
        };
        return res.status(200).json(cartWithTotals);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const create = async (req, res) => {
    try {
        const newCart = await CartService.create(req.body);
        return res.status(201).json(newCart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCart = await CartService.update(id, req.body);
        if (!updatedCart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        return res.status(200).json(updatedCart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await CartService.remove(id);
        return res.status(200).json({ message: 'Carrito eliminado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await CartService.clearCart(userId);
        return res.status(200).json({ 
            message: 'Carrito vaciado exitosamente',
            cart 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getCartTotal = async (req, res) => {
    try {
        const { userId } = req.params;
        const total = await CartService.getCartTotal(userId);
        return res.status(200).json({ total: total.toFixed(2) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        console.log('🛒 Añadiendo al carrito:', { userId, productId, quantity });
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ 
                message: 'userId, productId y quantity son requeridos' 
            });
        }
        let cart = await CartService.findByUserId(parseInt(userId));
        if (!cart) {
            cart = await CartService.create({ 
                usuarioId: parseInt(userId), 
                estado: 'activo' 
            });
        }
        const Product = (await import('../models/product.js')).default;
        const product = await Product.findByPk(parseInt(productId));
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const CartItem = (await import('../models/cartItem.js')).default;
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
        await CartService.update(cart.id, { total: total.toFixed(2) });
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
const getCartItems = async (req, res) => {
    try {
        const { cartId } = req.params;
        const CartItem = (await import('../models/cartItem.js')).default;
        const Product = (await import('../models/product.js')).default;
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
const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        console.log('🔄 Actualizando cantidad:', { userId, productId, quantity });
        const cart = await CartService.findByUserId(parseInt(userId));
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const CartItem = (await import('../models/cartItem.js')).default;
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
        const Product = (await import('../models/product.js')).default;
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [Product]
        });
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.precioUnitario) * item.quantity);
        }, 0);
        await CartService.update(cart.id, { total: total.toFixed(2) });
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
const removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        console.log('🗑️ Eliminando del carrito:', { userId, productId });
        const cart = await CartService.findByUserId(parseInt(userId));
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const CartItem = (await import('../models/cartItem.js')).default;
        const deletedRows = await CartItem.destroy({
            where: { 
                cartId: cart.id, 
                productId: parseInt(productId) 
            }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Item no encontrado en el carrito' });
        }
        const Product = (await import('../models/product.js')).default;
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [Product]
        });
        const total = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.precioUnitario) * item.quantity);
        }, 0);
        await CartService.update(cart.id, { total: total.toFixed(2) });
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
    findOne,
    getCartByUser,
    create,
    update,
    remove,
    clearCart,
    getCartTotal,
    addToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem
};

