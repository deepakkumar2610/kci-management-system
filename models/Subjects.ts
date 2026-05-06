import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    name: { type: String, required: true }, // Maths
  },
  { timestamps: true },
);

export default mongoose.models.Subject ||
  mongoose.model("Subject", subjectSchema);
