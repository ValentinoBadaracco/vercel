import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  reviews: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

