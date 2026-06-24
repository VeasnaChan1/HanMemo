// src/models/UserLesson.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserLesson = sequelize.define('UserLesson', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  is_unlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'user_lessons', // Forces Sequelize to use this exact table name
  timestamps: false, // You didn't have created_at/updated_at in your SQL for this
});

export default UserLesson;