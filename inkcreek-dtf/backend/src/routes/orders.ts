import { Router } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { config } from '../config';

const router = Router();

function generateOrderNumber() {
  return 'IC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

router.post('/', async (req, res) => {
  try {
    const { sheetSizeId, quantity, transferType, rushOrder, designs, customerEmail, customerName } = req.body;
    if (!sheetSizeId || !quantity || !customerEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const subtotal = req.body.subtotal ?? 0;
    const tax = req.body.tax ?? 0;
    const total = req.body.total ?? 0;

    await mongoose.connect(config.mongoUri);

    const order = new Order({
      orderNumber: generateOrderNumber(),
      sheetSizeId,
      quantity,
      transferType: transferType || 'standard',
      rushOrder: !!rushOrder,
      designs: designs || [],
      subtotal,
      tax,
      total,
      currency: 'cad',
      customerEmail,
      customerName,
      status: 'pending',
    });
    await order.save();

    res.status(201).json({
      id: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await mongoose.connect(config.mongoUri);
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

export const orderRoutes = router;
