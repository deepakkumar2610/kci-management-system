import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Student from "@/models/Student";

export async function GET() {
  try {
    await connectDB();

    const [totalStudents, studentFees, paymentResult] = await Promise.all([
      Student.countDocuments(),

      Student.aggregate([
        {
          $group: {
            _id: null,
            totalFees: {
              $sum: "$fees.finalFees",
            },
          },
        },
      ]),

      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalReceived: {
              $sum: "$amountPaid",
            },
          },
        },
      ]),
    ]);

    const totalFees = studentFees[0]?.totalFees || 0;
    const totalReceived = paymentResult[0]?.totalReceived || 0;

    const pendingFees = totalFees - totalReceived;

    const collectionPercentage =
      totalFees > 0
        ? Number(((totalReceived / totalFees) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalFees,
        totalReceived,
        pendingFees,
        collectionPercentage,
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
