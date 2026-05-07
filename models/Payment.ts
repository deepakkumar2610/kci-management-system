import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    paymentMode: String,
    txnId: String,

    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);