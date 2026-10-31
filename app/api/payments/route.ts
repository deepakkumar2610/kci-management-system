import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { generateReceiptNumber } from "@/lib/generateReceiptNumber";
import Student from "@/models/Student";

// ➕ CREATE PAYMENT
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // ✅ Create payment
    const payment = await Payment.create({
      ...body,
      receiptNumber,
    });

    // Update student's paid and remaining fees
    const student = await Student.findById(body.studentId);

    if (student) {
      const paidAmount =
        (student.fees?.paidAmount || 0) + Number(body.amountPaid);

      const finalFees = student.fees?.finalFees || 0;

      student.fees.paidAmount = paidAmount;
      student.fees.remainingAmount = Math.max(0, finalFees - paidAmount);

      await student.save();
    }

    return Response.json(payment);
  } catch (error) {
    console.log("PAYMENT ERROR:", error);

    return Response.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
