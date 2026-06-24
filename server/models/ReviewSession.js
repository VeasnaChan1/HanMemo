// src/models/ReviewSession.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ReviewSession = sequelize.define('ReviewSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ease_factor: {
    type: DataTypes.FLOAT,
    defaultValue: 2.5,
  },
  interval_day: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  repetitions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  next_review: {
    type: DataTypes.DATEONLY, // DATEONLY matches SQL 'DATE'
    allowNull: false,
  },
  last_rating: {
    type: DataTypes.TINYINT,
  }
}, {
  tableName: 'review_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ReviewSession;