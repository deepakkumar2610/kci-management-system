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

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card"],
      default: "cash",
    },

    installmentNumber: {
      type: Number,
    },

    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
