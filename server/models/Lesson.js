// src/models/Lesson.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lesson_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_unlocked_by_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Lesson;