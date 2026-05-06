import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    // 🔹 Basic Info
    fullName: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String },

    // 🔹 Parent Info
    parentName: { type: String },
    parentContact: { type: String },

    // 🔹 Academic References
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
    },
    subjectIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    medium: { type: String },

    // 🔥 Fee Snapshot (CRITICAL DESIGN)
    fees: {
      totalFees: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      finalFees: { type: Number, required: true },
      installments: { type: Number, default: 1 },
    },

    // 🔹 Optional Info
    photoUrl: { type: String },

    // 🔹 Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);
