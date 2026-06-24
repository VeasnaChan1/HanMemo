// src/models/Vocabulary.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Vocabulary = sequelize.define('Vocabulary', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  hanzi: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  pinyin: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  part_of_speech: {
    type: DataTypes.STRING(20),
  },
  definition_en: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  definition_km: {
    type: DataTypes.STRING(255),
  },
  example_cn: {
    type: DataTypes.STRING(255),
  },
  example_pinyin: {
    type: DataTypes.STRING(255),
  },
  example_en: {
    type: DataTypes.STRING(255),
  },
  example_km: {
    type: DataTypes.STRING(255),
  },
  hsk_level: {
    type: DataTypes.TINYINT,
    allowNull: false,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default Vocabulary;