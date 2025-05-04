import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
    product: mongoose.Schema.Types.ObjectId; // Reference to Product
    quantity: number; // Quantity of the product in the cart
}

interface ICart extends Document {
    user: mongoose.Schema.Types.ObjectId; // Reference to the User
    items: ICartItem[]; // Array of cart items
    totalPrice: number; // Total price of all items in the cart
}

const cartItemSchema: Schema<ICartItem> = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const cartSchema: Schema<ICart> = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [cartItemSchema],
        totalPrice: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;