import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';
const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    price_usd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    price_pen: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    }
}, {
    tableName: 'order_items',
    timestamps: false
});
export default OrderItem;

