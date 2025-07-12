import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';
const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    nombres: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nroDocumento: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'cliente',
        validate: {
            isIn: [['cliente', 'admin']],
        }
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'activo',
        validate: {
            isIn: [['activo', 'inactivo']],
        }
    },
    fechaRegistro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'users'
});
export default User;

