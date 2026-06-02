import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { generateReceiptNumber } from "@/lib/generateReceiptNumber";

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

    return Response.json(payment);
  } catch (error) {
    console.log("PAYMENT ERROR:", error);

    return Response.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
