import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { generateReceiptNumber } from "@/lib/generateReceiptNumber";

// function generateReceiptNumber() {
//   return "KCI-" + Date.now();
// }

const receiptNumber = await generateReceiptNumber();
console.log("receiptNumber: ", receiptNumber);

// ➕ CREATE PAYMENT
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const payment = await Payment.create({
      ...body,
      receiptNumber: receiptNumber,
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
