import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    brand?: string;
    category: string;
    event?: string;
    sizes: string[];
    stock: number;
    variants: Array<{
        size: string;
        color?: string;
        stock: number;
        price?: number;
    }>;
    isActive: boolean;
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        brand: { type: String, required: false },
        category: { type: String, required: true },
        event: { type: String, required: false },
        sizes: {
            type: [String],
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            default: [],
        },
        stock: { type: Number, required: true, default: 0 },
        variants: [
            {
                size: {
                    type: String,
                    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                    required: true,
                },
                color: { type: String },
                stock: { type: Number, default: 0 },
                price: { type: Number },
            },
        ],
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Create a model from the schema
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
