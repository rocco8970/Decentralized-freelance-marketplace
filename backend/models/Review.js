import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model("Review", reviewSchema);
