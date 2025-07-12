import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    usuario: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    usuarioId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id'
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'order_date'
    },
    total: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Pendiente',
        validate: {
            isIn: [['Pendiente', 'Por entregar', 'Entregado', 'Cancelado']]
        }
    },
    total_price_usd: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    total_price_pen: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'orders'
});
export default Order;

