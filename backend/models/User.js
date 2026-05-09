import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  walletAddress: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["client", "freelancer"], default: "freelancer" },
  createdAt: { type: Date, default: Date.now }
});

export default model("User", userSchema);
