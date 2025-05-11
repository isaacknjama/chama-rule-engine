import mongoose, { Schema, Document } from 'mongoose';
import {
  Wallet,
  OwnerType,
  Transaction,
  TransactionType,
  TransactionStatus,
} from '../wallet/wallet';

// Define Transaction schema
const TransactionSchema = new Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: Object.values(TransactionType),
    required: true,
  },
  timestamp: { type: Date, required: true, default: Date.now },
  description: { type: String },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    required: true,
    default: TransactionStatus.PENDING,
  },
});

// Define Wallet Schema
const WalletSchema = new Schema({
  id: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, required: true, default: 'KES' },
  ownerId: { type: String, required: true },
  ownerType: {
    type: String,
    enum: Object.values(OwnerType),
    required: true,
  },
  transactions: [TransactionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create Wallet Document Type
export interface WalletDocument extends Document, Omit<Wallet, 'id'> {
  id: string;
}

// Create and export Wallet model
export const WalletModel = mongoose.model<WalletDocument>(
  'Wallet',
  WalletSchema
);
