// models/Job.js
import { Schema, model } from "mongoose";

const jobSchema = new Schema({
  title: String,
  description: String,
  client: String,
  freelancer: String,
  status: { type: String, enum: ["Open", "Accepted", "Completed"], default: "Open" },
});

export default model("Job", jobSchema);


