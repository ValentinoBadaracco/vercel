import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVote extends Document {
  user: Types.ObjectId; 
  review: Types.ObjectId; 
  value: number; 
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  review: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
