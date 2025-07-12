import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';
const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    categoria: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    precio: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    unidad: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'kg'
    },
    imagen: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    presentacion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    marca: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    timestamps: true,
    tableName: 'products'
});
export default Product;

