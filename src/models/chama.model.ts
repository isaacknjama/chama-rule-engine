import mongoose, { Schema, Document } from 'mongoose';
import { Chama, MemberRole } from '../chama/chama';

// Define Member schema
const MemberSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  npub: { type: String },
  role: {
    type: String,
    enum: Object.values(MemberRole),
    default: MemberRole.MEMBER
  },
  joinedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});

// Define Chama Schema
const ChamaSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  walletId: { type: String, required: true },
  description: { type: String },
  members: [MemberSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Chama Document Type
export interface ChamaDocument extends Document, Omit<Chama, 'id'> {
  id: string;
}

// Create and export Chama model
export const ChamaModel = mongoose.model<ChamaDocument>('Chama', ChamaSchema);