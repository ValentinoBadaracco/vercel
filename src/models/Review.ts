import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId; 
  bookId: string; 
  rating: number;
  text: string;
  votes: number;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
