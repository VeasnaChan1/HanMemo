// src/models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'learner'),
    defaultValue: 'learner',
  },
  hsk_level: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  language: {
    type: DataTypes.ENUM('en', 'km'),
    defaultValue: 'km',
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_active: {
    type: DataTypes.DATEONLY,
  }
}, {
  timestamps: true,
  createdAt: 'created_at', // Tells Sequelize to name the column created_at instead of createdAt
  updatedAt: false, // You didn't have updated_at in your SQL for users
});

export default User;