import mongoose, { Schema, Document } from 'mongoose';

import { Product } from '../types';

export interface ProductDocument extends Document<Product> {}

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, unique: true },
  category: { type: String },
  price: { type: Number, required: true },
});

export const ProductModel = mongoose.model<ProductDocument>(
  'Product',
  ProductSchema
);
