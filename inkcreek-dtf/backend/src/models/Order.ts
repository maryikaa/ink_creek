import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDesignBlock {
  id: string;
  fileId: string;
  fileName: string;
  previewUrl?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  copies: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  sheetSizeId: string;
  quantity: number;
  transferType: 'standard' | 'glow' | 'reflective';
  rushOrder: boolean;
  designs: IDesignBlock[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'cancelled';
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DesignBlockSchema = new Schema({
  id: String,
  fileId: String,
  fileName: String,
  previewUrl: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  rotation: Number,
  copies: Number,
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    sheetSizeId: { type: String, required: true },
    quantity: { type: Number, required: true },
    transferType: { type: String, enum: ['standard', 'glow', 'reflective'], default: 'standard' },
    rushOrder: { type: Boolean, default: false },
    designs: [DesignBlockSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: 'cad' },
    customerEmail: { type: String, required: true },
    customerName: String,
    status: { type: String, enum: ['pending', 'paid', 'processing', 'shipped', 'cancelled'], default: 'pending' },
    stripePaymentIntentId: String,
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
