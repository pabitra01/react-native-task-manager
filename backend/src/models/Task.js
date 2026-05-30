const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
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
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending',
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id',
    },
  },
}, {
  tableName: 'tasks',
});

module.exports = Task;
