// lib/generateReceiptNumber.ts

import Counter from "@/models/Counter";

export async function generateReceiptNumber() {
  // Current Year
  const year = new Date().getFullYear();

  // Counter name year-wise
  const counterName = `receipt-${year}`;

  // Increment sequence
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
    },
  );

  // Convert to 4 digits
  const sequence = counter.sequence.toString().padStart(4, "0");

  // Final Receipt Number
  return `KCI-${year}-${sequence}`;
}
