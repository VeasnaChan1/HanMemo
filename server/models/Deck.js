// src/models/Deck.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Deck = sequelize.define('Deck', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  hsk_level: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Deck;