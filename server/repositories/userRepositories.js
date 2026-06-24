import db from '../config/db.js';

export const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const create = async ({ name, email, hashedPassword, hsk_level }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, hsk_level) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, hsk_level]
  );
  return { id: result.insertId, name, email, role: 'learner', hsk_level };
};