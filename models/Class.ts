// models/Class.ts
import mongoose, { Schema } from "mongoose";

const classSchema = new Schema({
  name: { type: String, required: true },
  board: String,
  type: String,
  status: { type: String, default: "active" },
});

export default mongoose.models.Class || mongoose.model("Class", classSchema);
