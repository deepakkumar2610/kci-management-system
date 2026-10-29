/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";

type AttendanceStatus = "Present" | "Absent" | "Leave";

type AttendanceCounts = {
  present: number;
  absent: number;
  leave: number;
};

const createCounts = (): AttendanceCounts => ({
  present: 0,
  absent: 0,
  leave: 0,
});

const getPercentage = (counts: AttendanceCounts): number => {
  const eligible = counts.present + counts.absent;

  if (eligible === 0) return 0;

  return Number(((counts.present / eligible) * 100).toFixed(2));
};

const getDateBoundary = (value: string, endOfDay = false): Date | null => {
  let date: Date;

  // Handle date-picker values such as 2026-10-01 as local dates.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);

    date = new Date(
      year,
      month - 1,
      day,
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0,
    );

    // Reject invalid calendar dates.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
};

const formatDate = (value: Date): string => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getId = (value: any): string => {
  return String(value?._id ?? value);
};

const getStatus = (value: string): AttendanceStatus | null => {
  if (value === "Present" || value === "Absent" || value === "Leave") {
    return value;
  }

  return null;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const classId = searchParams.get("classId");
    const batchId = searchParams.get("batchId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const studentId = searchParams.get("studentId");
    const reportType = searchParams.get("reportType") || "daily";

    // Required filters
    if (!classId || !batchId || !from || !to) {
      return NextResponse.json(
        {
          success: false,
          message: "classId, batchId, from and to are required",
        },
        { status: 400 },
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(classId) ||
      !mongoose.Types.ObjectId.isValid(batchId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid classId or batchId",
        },
        { status: 400 },
      );
    }

    if (studentId && !mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid studentId",
        },
        { status: 400 },
      );
    }

    if (!["daily", "student-wise"].includes(reportType)) {
      return NextResponse.json(
        {
          success: false,
          message: "reportType must be daily or student-wise",
        },
        { status: 400 },
      );
    }

    const fromDate = getDateBoundary(from);
    const toDate = getDateBoundary(to, true);

    if (!fromDate || !toDate || fromDate.getTime() > toDate.getTime()) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date range",
        },
        { status: 400 },
      );
    }

    const studentFilter: Record<string, any> = {
      classId,
      batchId,
    };

    if (studentId) {
      studentFilter._id = studentId;
    }

    const students = (await Student.find(studentFilter)
      .select("fullName classId batchId")
      .sort({ fullName: 1 })
      .lean()) as any[];

    if (studentId && students.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found in the selected class and batch",
        },
        { status: 404 },
      );
    }

    const attendance = (await Attendance.find({
      classId,
      batchId,
      date: {
        $gte: fromDate,
        $lte: toDate,
      },
    })
      .populate("classId", "gradeName")
      .populate("batchId", "name")
      .sort({ date: 1 })
      .lean()) as any[];

    // DAILY REPORT
    if (reportType === "daily") {
      const dailyReport = attendance.map((session) => {
        const counts = createCounts();
        let studentStatus: AttendanceStatus | null = null;

        for (const record of session.records ?? []) {
          const recordStudentId = getId(record.studentId);

          if (studentId && recordStudentId !== studentId) {
            continue;
          }

          const status = getStatus(record.status);

          if (!status) continue;

          if (studentId) {
            studentStatus = status;
          }

          if (status === "Present") counts.present++;
          if (status === "Absent") counts.absent++;
          if (status === "Leave") counts.leave++;
        }

        return {
          date: formatDate(session.date),
          classId: getId(session.classId),
          className: session.classId?.gradeName ?? "",
          batchId: getId(session.batchId),
          batchName: session.batchId?.name ?? "",
          present: counts.present,
          absent: counts.absent,
          leave: counts.leave,
          totalMarked: counts.present + counts.absent + counts.leave,
          attendancePercentage: getPercentage(counts),
          ...(studentId
            ? {
                studentId,
                studentName: students[0].fullName,
                status: studentStatus,
              }
            : {}),
        };
      });

      return NextResponse.json({
        success: true,
        reportType: "daily",
        filters: {
          classId,
          batchId,
          from,
          to,
          studentId: studentId || null,
        },
        report: dailyReport,
      });
    }

    // STUDENT-WISE REPORT
    const studentCounts = new Map<string, AttendanceCounts>();

    for (const student of students) {
      studentCounts.set(String(student._id), createCounts());
    }

    for (const session of attendance) {
      for (const record of session.records ?? []) {
        const id = getId(record.studentId);

        if (!studentCounts.has(id)) continue;

        const status = getStatus(record.status);

        if (!status) continue;

        const counts = studentCounts.get(id)!;

        if (status === "Present") counts.present++;
        if (status === "Absent") counts.absent++;
        if (status === "Leave") counts.leave++;
      }
    }

    const studentReport = students.map((student) => {
      const counts = studentCounts.get(String(student._id)) ?? createCounts();

      return {
        studentId: String(student._id),
        studentName: student.fullName,
        present: counts.present,
        absent: counts.absent,
        leave: counts.leave,
        totalMarked: counts.present + counts.absent + counts.leave,
        attendancePercentage: getPercentage(counts),
      };
    });

    return NextResponse.json({
      success: true,
      reportType: "student-wise",
      filters: {
        classId,
        batchId,
        from,
        to,
        studentId: studentId || null,
      },
      report: studentReport,
    });
  } catch (error) {
    console.error("Attendance Report Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate attendance report",
      },
      { status: 500 },
    );
  }
}
