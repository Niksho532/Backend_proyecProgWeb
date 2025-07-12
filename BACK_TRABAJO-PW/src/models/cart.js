import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';
const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id'
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    fechaActualizacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'activo',
        validate: {
            isIn: [['activo', 'abandonado', 'convertido']]
        }
    }
}, {
    tableName: 'carts',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
});
export default Cart;

