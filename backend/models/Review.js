
import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
  jobId: String,
  reviewer: String,
  target: String,
  rating: Number,
  comment: String,
});

export default model("Review", reviewSchema);
