// models/Job.js
import { Schema, model } from "mongoose";

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date },
  skills: [String],
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  acceptedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ["Open", "Accepted", "Completed"], default: "Open" },
  createdAt: { type: Date, default: Date.now }
});

export default model("Job", jobSchema);
