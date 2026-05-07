import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    sequence: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Counter ||
  mongoose.model("Counter", counterSchema);
