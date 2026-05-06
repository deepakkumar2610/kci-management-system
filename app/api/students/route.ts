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

    const search = req.nextUrl.searchParams.get("search");

    let query: any = {};

    const cleanSearch = search?.trim();

    if (cleanSearch) {
      query = {
        $or: [
          { fullName: { $regex: cleanSearch, $options: "i" } },
          { contact: { $regex: cleanSearch, $options: "i" } },
        ],
      };
    }

    const students = await Student.find(query)
      .populate("classId")
      .populate("batchId")
      .populate("subjectIds");

    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
