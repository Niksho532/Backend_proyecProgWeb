import Cart from '../models/cart.js';
import CartItem from '../models/cartItem.js';
import Product from '../models/product.js';
import User from '../models/user.js';
const findAll = async () => {
    return await Cart.findAll({
        include: [
            {
                model: User,
                attributes: ['nombres', 'apellidos', 'correo']
            },
            {
                model: CartItem,
                include: [
                    {
                        model: Product,
                        attributes: ['nombre', 'categoria', 'precio', 'imagen', 'stock']
                    }
                ]
            }
        ]
    });
};
const findOne = async (id) => {
    return await Cart.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['nombres', 'apellidos', 'correo']
            },
            {
                model: CartItem,
                include: [
                    {
                        model: Product,
                        attributes: ['nombre', 'categoria', 'precio', 'imagen', 'stock']
                    }
                ]
            }
        ]
    });
};
const findByUserId = async (usuarioId) => {
    let cart = await Cart.findOne({
        where: { usuarioId, estado: 'activo' },
        include: [
            {
                model: CartItem,
                include: [
                    {
                        model: Product,
                        attributes: ['nombre', 'categoria', 'precio', 'imagen', 'stock']
                    }
                ]
            }
        ]
    });
    if (!cart) {
        cart = await Cart.create({ usuarioId, estado: 'activo' });
        cart = await Cart.findByPk(cart.id, {
            include: [
                {
                    model: CartItem,
                    include: [
                        {
                            model: Product,
                            attributes: ['nombre', 'categoria', 'precio', 'imagen', 'stock']
                        }
                    ]
                }
            ]
        });
    }
    return cart;
};
const create = async (data) => {
    return await Cart.create(data);
};
const update = async (id, data) => {
    const cart = await Cart.findByPk(id);
    if (!cart) return null;
    await cart.update(data);
    return cart;
};
const remove = async (id) => {
    return await Cart.destroy({ where: { id } });
};
const clearCart = async (usuarioId) => {
    const cart = await findByUserId(usuarioId);
    if (cart) {
        await CartItem.destroy({ where: { cartId: cart.id } });
        await cart.update({ estado: 'convertido' });
    }
    return cart;
};
const convertToOrder = async (usuarioId) => {
    const cart = await findByUserId(usuarioId);
    if (cart) {
        await cart.update({ estado: 'convertido' });
    }
    return cart;
};
const getCartTotal = async (usuarioId) => {
    const cart = await findByUserId(usuarioId);
    if (!cart || !cart.CartItems) return 0;
    return cart.CartItems.reduce((total, item) => {
        return total + (parseFloat(item.precioUnitario) * item.quantity);
    }, 0);
};
export default {
    findAll,
    findOne,
    findByUserId,
    create,
    update,
    remove,
    clearCart,
    convertToOrder,
    getCartTotal
};

