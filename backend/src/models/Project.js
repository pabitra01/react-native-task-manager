const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'projects',
});

module.exports = Project;
