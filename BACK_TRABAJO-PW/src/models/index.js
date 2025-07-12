import User from './user.js';
import Product from './product.js';
import ProductCategory from './productCategory.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Cart from './cart.js';
import CartItem from './cartItem.js';
ProductCategory.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id' });
User.hasMany(Order, { foreignKey: 'usuarioId', sourceKey: 'id' });
Order.belongsTo(User, { foreignKey: 'usuarioId', targetKey: 'id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'productos' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
User.hasMany(Cart, { foreignKey: 'usuarioId', sourceKey: 'id' });
Cart.belongsTo(User, { foreignKey: 'usuarioId', targetKey: 'id' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });
export {
    User,
    Product,
    ProductCategory,
    Order,
    OrderItem,
    Cart,
    CartItem
};

