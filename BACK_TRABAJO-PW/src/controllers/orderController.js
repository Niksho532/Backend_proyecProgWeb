import OrderService from '../services/orderService.js';
const createOrder = async (req, res) => {
    try {
        console.log('🔍 [Backend Order] Received request body:', req.body);
        console.log('🔍 [Backend Order] Request headers:', req.headers);
        const { usuarioId, user_id, usuario_id, total, productos, items, total_price_usd, total_price_pen } = req.body;
        const finalUserId = usuarioId || user_id || usuario_id;
        const finalTotal = total || `S/${total_price_pen || total_price_usd || '0.00'}`;
        const finalProductos = productos || items || [];
        console.log('🔍 [Backend Order] Extracted values:');
        console.log('   usuarioId:', usuarioId, typeof usuarioId);
        console.log('   user_id:', user_id, typeof user_id);
        console.log('   usuario_id:', usuario_id, typeof usuario_id);
        console.log('   finalUserId:', finalUserId, typeof finalUserId);
        console.log('   finalTotal:', finalTotal);
        console.log('   productos:', productos?.length || 0, 'items:', items?.length || 0);
        console.log('   finalProductos length:', finalProductos.length);
        if (!finalUserId) {
            console.log('❌ [Backend Order] Validation failed - missing user ID');
            return res.status(400).json({ message: 'Usuario ID es obligatorio' });
        }
        if (!finalProductos || finalProductos.length === 0) {
            console.log('❌ [Backend Order] Validation failed - no products/items');
            return res.status(400).json({ message: 'Debe incluir al menos un producto en la orden' });
        }
        console.log('✅ [Backend Order] Validation passed, calling service...');
        const newOrder = await OrderService.createOrder(finalUserId, finalTotal, finalProductos);
        console.log('✅ [Backend Order] Service call successful:', newOrder);
        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('❌ [Backend Order] Error:', error);
        return res.status(500).json({ message: error.message });
    }
};
const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const orderDetails = await OrderService.getOrderDetails(id);
        if (!orderDetails || orderDetails.length === 0) {
            return res.status(404).json({ message: 'Detalles de la orden no encontrados' });
        }
        return res.status(200).json(orderDetails);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await OrderService.findByUserId(userId);
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderService.findOne(id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export default { 
    createOrder, 
    getOrderDetails, 
    getOrdersByUser,
    getOrderById
};

