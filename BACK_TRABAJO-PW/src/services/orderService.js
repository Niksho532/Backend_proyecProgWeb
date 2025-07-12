import Order from '../models/order.js';
import OrderItem from '../models/orderItem.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import CartService from './cartService.js';
const findAll = async () => {
    return await Order.findAll({
        include: [
            {
                model: User,
                attributes: ['nombres', 'apellidos', 'correo']
            },
            {
                model: OrderItem,
                as: 'productos',
                attributes: ['product_id', 'nombre', 'categoria', 'quantity', 'precio']
            }
        ]
    });
};
const findOne = async (id) => {
    return await Order.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['nombres', 'apellidos', 'correo']
            },
            {
                model: OrderItem,
                as: 'productos',
                attributes: ['product_id', 'nombre', 'categoria', 'quantity', 'precio']
            }
        ]
    });
};
const create = async (orderData) => {
    return await Order.create(orderData);
};
const update = async (id, data) => {
    const order = await Order.findByPk(id);
    if (!order) return null;
    await order.update(data);
    return order;
};
const remove = async (id) => {
    return await Order.destroy({ where: { id } });
};
const findByUserId = async (usuarioId) => {
    return await Order.findAll({ 
        where: { usuarioId },
        include: [
            {
                model: OrderItem,
                as: 'productos',
                attributes: ['product_id', 'nombre', 'categoria', 'quantity', 'precio']
            }
        ]
    });
};
const createOrder = async (usuarioId, total, productos = []) => {
    console.log('🔍 [Service] createOrder called with:', { usuarioId, total, productos: productos?.length });
    console.log('🔍 [Service] usuarioId type:', typeof usuarioId, 'value:', usuarioId);
    console.log('🔍 [Service] productos received:', productos);
    if (!usuarioId) {
        throw new Error('Usuario ID es obligatorio en el servicio');
    }
    const orderId = '#' + Date.now().toString().slice(-4);
    const orderData = {
        id: orderId,
        usuarioId: usuarioId.toString(),
        usuario: '',
        fecha: new Date().toISOString().split('T')[0],
        total: total,
        estado: 'Pendiente'
    };
    const user = await User.findByPk(usuarioId);
    if (user) {
        orderData.usuario = `${user.nombres} ${user.apellidos}`;
    }
    const newOrder = await Order.create(orderData);
    if (productos && productos.length > 0) {
        const orderItems = productos.map(producto => {
            const productId = producto.producto_id || producto.id;
            const quantity = producto.cantidad || producto.quantity || 1;
            const precio = producto.precio_unitario || producto.precio;
            console.log('🔍 [Service] Processing product:', {
                original: producto,
                mapped: { productId, quantity, precio }
            });
            return {
                order_id: orderId,
                product_id: productId,
                nombre: producto.nombre,
                categoria: producto.categoria || 'General',
                quantity: quantity,
                precio: precio
            };
        });
        console.log('🔍 [Service] Creating order items:', orderItems);
        await OrderItem.bulkCreate(orderItems);
        await CartService.convertToOrder(usuarioId);
    }
    return newOrder;
};
const getOrderDetails = async (orderId) => {
    return await OrderItem.findAll({
        where: { order_id: orderId }
    });
};
export default { 
    findAll, 
    findOne, 
    create, 
    update, 
    remove, 
    findByUserId,
    createOrder,
    getOrderDetails
};

