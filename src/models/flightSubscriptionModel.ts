import mongoose, { Document, Schema } from 'mongoose';

export interface IFlightSubscription extends Document {
  origin: string;
  destination: string;
  departureDate: Date;
  currentPrice?: number;
  targetPrice?: number;
  currency: string;
  flightResponse: Record<string, unknown>;
  isActive: boolean;
  lastCheckedAt: Date;
}

const flightSubscriptionSchema: Schema<IFlightSubscription> = new mongoose.Schema(
  {
    origin: { type: String, required: true, uppercase: true, trim: true },
    destination: { type: String, required: true, uppercase: true, trim: true },
    departureDate: { type: Date, required: true },
    currentPrice: { type: Number, min: 0 },
    targetPrice: { type: Number, min: 0 },
    currency: { type: String, required: true, uppercase: true, default: 'INR' },
    flightResponse: { type: Schema.Types.Mixed, required: true },
    isActive: { type: Boolean, default: true },
    lastCheckedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

flightSubscriptionSchema.index({ origin: 1, destination: 1, departureDate: 1 });

const FlightSubscription = mongoose.model<IFlightSubscription>(
  'FlightSubscription',
  flightSubscriptionSchema
);

export default FlightSubscription;
