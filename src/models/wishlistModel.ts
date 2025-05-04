import mongoose, { Schema, Document } from "mongoose";

interface IWishlistItem {
  product: mongoose.Schema.Types.ObjectId; // Reference to Product
}

interface IWishlist extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to the User
  items: IWishlistItem[]; // Array of wishlist items
}

const wishlistItemSchema: Schema<IWishlistItem> = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
});

const wishlistSchema: Schema<IWishlist> = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [wishlistItemSchema]
  },
  {
    timestamps: true
  }
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
