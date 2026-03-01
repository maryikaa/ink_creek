import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { config } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    await mongoose.connect(config.mongoUri);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    res.json({ token, email: user.email });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.get('/orders', authMiddleware, async (req, res) => {
  try {
    await mongoose.connect(config.mongoUri);
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.get('/orders/:id', authMiddleware, async (req, res) => {
  try {
    await mongoose.connect(config.mongoUri);
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

export const adminRoutes = router;
