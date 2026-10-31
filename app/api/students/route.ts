/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import "@/models/Class";
import "@/models/Batch";
import "@/models/Subjects";

// ➕ CREATE STUDENT
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      fullName,
      contact,
      email,
      parentName,
      parentContact,
      classId,
      batchId,
      subjectIds,
      medium,
      fees,
    } = body;

    // 🔥 Basic validation
    if (!fullName || !contact || !classId || !fees?.totalFees) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const student = await Student.create({
      fullName,
      contact,
      email,
      parentName,
      parentContact,
      classId,
      batchId,
      subjectIds,
      medium,
      fees,
    });

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("Student API Error:", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 📥 GET ALL STUDENTS
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const classId = searchParams.get("classId");
    const batchId = searchParams.get("batchId");
    const grade = searchParams.get("grade");

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);

    const all = searchParams.get("all") === "true";

    const cleanSearch = search.trim();

    const query: any = {};

    // 🔹 Class ID filter
    if (classId) {
      query.classId = classId;
    }

    // 🔹 Batch ID filter
    if (batchId) {
      query.batchId = batchId;
    }

    // 🔹 Grade filter
    if (grade) {
      const ClassModel = (await import("@/models/Class")).default;

      const selectedClass = await ClassModel.findOne({
        name: grade,
      }).select("_id");

      if (!selectedClass) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            currentPage: page,
            limit,
            totalStudents: 0,
            totalPages: 0,
          },
        });
      }

      query.classId = selectedClass._id;
    }

    // 🔹 Search filter
    if (cleanSearch) {
      query.$or = [
        { fullName: { $regex: cleanSearch, $options: "i" } },
        { contact: { $regex: cleanSearch, $options: "i" } },
      ];
    }

    // 🔹 Return all students (for dropdowns)
    if (all) {
      const students = await Student.find(query)
        .populate("classId")
        .populate("batchId")
        .populate("subjectIds")
        .sort({ fullName: 1 });

      return NextResponse.json({
        success: true,
        data: students,
      });
    }

    // 🔹 Pagination
    const skip = (page - 1) * limit;

    const [students, totalStudents] = await Promise.all([
      Student.find(query)
        .populate("classId")
        .populate("batchId")
        .populate("subjectIds")
        .sort({ fullName: 1 })
        .skip(skip)
        .limit(limit),

      Student.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalStudents / limit);

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        currentPage: page,
        limit,
        totalStudents,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Student GET API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
      },
      { status: 500 },
    );
  }
}
