import mongoose, { Schema } from "mongoose";

const feeSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    annualFees: {
      type: Number,
      required: true,
    },
    installmentsAllowed: {
      type: Number,
      default: 1,
    },
    installmentAmount: Number,
  },
  { timestamps: true },
);

export default mongoose.models.Fee || mongoose.model("Fee", feeSchema);
