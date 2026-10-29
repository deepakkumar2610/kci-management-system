/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const classId = searchParams.get("classId");
    const batchId = searchParams.get("batchId");

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const query: any = {};

    if (classId) {
      query.classId = classId;
    }

    if (batchId) {
      query.batchId = batchId;
    }

    if (from || to) {
      query.date = {};

      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);

        query.date.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);

        query.date.$lte = toDate;
      }
    }

    const attendance = await Attendance.find(query)
      .populate("classId", "gradeName")
      .populate("batchId", "name")
      .populate("records.studentId", "firstName lastName")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch attendance history",
      },
      { status: 500 },
    );
  }
}
