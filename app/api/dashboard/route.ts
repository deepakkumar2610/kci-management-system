import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await connectDB();

    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalReceived: {
            $sum: "$amountPaid",
          },
        },
      },
    ]);

    const totalReceived = result[0]?.totalReceived || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalReceived,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
      },
      { status: 500 },
    );
  }
}
