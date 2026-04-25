import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/mailer';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await User.create({
      email,
      password: hashed,
      verifyToken,
      verifyTokenExpiry,
      isVerified: false,
      bookshelves: [
        { category: 'Read',         color: '#4CAF50', books: [] },
        { category: 'Reading',      color: '#2196F3', books: [] },
        { category: 'Want to Read', color: '#FF9800', books: [] }
      ]
    });

    await sendVerificationEmail(email, verifyToken);
    res.status(201).json({ message: 'Account created. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired verification link' });
      return;
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify your email first' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const genericResponse = { message: 'If that email exists, a reset link has been sent.' };

    const user = await User.findOne({ email });
    if (!user) {
      res.status(200).json(genericResponse);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
    await user.save();

    await sendPasswordResetEmail(email, resetToken);
    res.status(200).json(genericResponse);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset link' });
      return;
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};