import * as authService from '../services/authService.js';
import * as userRepository from '../repositories/userRepository.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, hsk_level } = req.body;

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await authService.hashPassword(password);
    const newUser = await userRepository.create({ name, email, hashedPassword, hsk_level });
    const token = authService.generateToken(newUser);

    res.status(201).json({ message: 'Account created', token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await authService.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = authService.generateToken(user);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        hsk_level: user.hsk_level,
        language: user.language
      }
    });
  } catch (err) {
    next(err);
  }
};