import mongoose, { Schema, Document } from "mongoose";
import Counter from "./counterModel";
import bcrypt from "bcryptjs";

// Define an interface for the User document
export interface IUser extends Document {
  eid: number; // Auto-generated
  name: string;
  email: string;
  password: string;
  role: string;
  team: string;
  comparePassword: (password: string) => Promise<boolean>; // Method to compare password
}

// Define the schema
const userSchema: Schema = new Schema(
  {
    eid: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    team: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate `eid` using Counter
userSchema.pre<IUser>("save", async function (next) {
  if (!this.eid) {
    const counter = await Counter.findOneAndUpdate(
      { name: "userEid" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.eid = counter.seq;
  }
  next();
});

// Pre-save hook to hash password before saving it to the database
userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
  }
  next();
});

// Method to compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password); // Compare hash with entered password
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
