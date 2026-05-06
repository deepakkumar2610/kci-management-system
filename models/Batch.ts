import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    name: { type: String, required: true }, // Morning
    timing: { type: String }, // 7-9 AM
    capacity: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.models.Batch || mongoose.model("Batch", batchSchema);
