import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFavorite extends Document {
  user: Types.ObjectId; // Referencia al usuario
  bookId: string; // ID de Google Books
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);
