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
  indexes: [
    // 1. Optimize performance for checking reviews due today
    {
      name: 'idx_user_next_review',
      fields: ['user_id', 'next_review']
    },
    // 2. Ensure data integrity (a user shouldn't have duplicate session records for one word)
    {
      name: 'idx_user_vocab',
      unique: true,
      fields: ['user_id', 'vocab_id']
    }
  ]
});

export default ReviewSession;