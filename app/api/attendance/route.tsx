/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const date = searchParams.get("date");
    const classId = searchParams.get("classId");
    const batchId = searchParams.get("batchId");

    if (!date || !classId || !batchId) {
      return NextResponse.json(
        {
          success: false,
          message: "date, classId and batchId are required",
        },
        { status: 400 },
      );
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      date: selectedDate,
      classId,
      batchId,
    }).lean();

    const students = await Student.find({
      classId,
      batchId,
    })
      .sort({ fullName: 1 })
      .lean();

    const attendanceMap = new Map();

    if (attendance) {
      attendance.records.forEach((record: any) => {
        attendanceMap.set(record.studentId.toString(), record.status);
      });
    }

    const result = students.map((student: any) => ({
      studentId: student._id,
      name: student.fullName,
      status: attendanceMap.get(student._id.toString()) || "Present",
    }));

    return NextResponse.json({
      success: true,
      attendanceExists: !!attendance,
      students: result,
    });
  } catch (error) {
    console.error("Attendance GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch attendance",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const { date, classId, batchId, records } = body;

    // Validation
    if (
      !date ||
      !classId ||
      !batchId ||
      !Array.isArray(records) ||
      records.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Date, class, batch and attendance records are required",
        },
        { status: 400 },
      );
    }

    // Normalize date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Save / update attendance
    const attendance = await Attendance.findOneAndUpdate(
      {
        date: attendanceDate,
        classId,
        batchId,
      },
      {
        $set: {
          records,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json({
      success: true,
      message: "Attendance saved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Save Attendance Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save attendance",
      },
      { status: 500 },
    );
  }
}
