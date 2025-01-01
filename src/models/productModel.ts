import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
}

const productSchema: Schema<IProduct> = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;