import mongoose, { Schema, Document } from 'mongoose';

const ScheduleSchema = new Schema({
  interval: { type: Number, required: true },
  startTime: { type: Date },
  endTime: { type: Date }
});

const RuleSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastExecuted: { type: Date },
  schedule: ScheduleSchema,  
});

// Define RuleDocument interface
export interface RuleDocument extends Document {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
  schedule?: {
    interval: number;
    startTime?: Date;
    endTime?: Date;
  };
};

// Create and export Rule model
export const RuleModel = mongoose.model<RuleDocument>('Rule', RuleSchema);