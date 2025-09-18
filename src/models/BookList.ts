import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookList extends Document {
  user: Types.ObjectId; 
  bookId: string;
  createdAt: Date;
}

const BookListSchema = new Schema<IBookList>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.BookList || mongoose.model<IBookList>('BookList', BookListSchema);
