const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  otp: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  otp_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
});

module.exports = User;
