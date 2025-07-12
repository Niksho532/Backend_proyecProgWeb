import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';
const ProductCategory = sequelize.define('ProductCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imagen: {
        type: DataTypes.STRING(500),
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'product_categories'
});
export default ProductCategory;

