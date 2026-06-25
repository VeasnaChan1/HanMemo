import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// --- REGISTER A NEW USER ---
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 2. Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Save the new user to the database
    const newUser = await User.create({
      name,
      email,
      password_hash
    });

    // 4. Generate a JWT Token
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Token expires in 7 days
    });

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// --- LOGIN AN EXISTING USER ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 2. Compare the provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 3. Generate a JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};