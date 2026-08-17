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
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const search = req.nextUrl.searchParams.get("search");
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;

//     let query: any = {};

//     const cleanSearch = search?.trim();

//     if (cleanSearch) {
//       query = {
//         $or: [
//           { fullName: { $regex: cleanSearch, $options: "i" } },
//           { contact: { $regex: cleanSearch, $options: "i" } },
//         ],
//       };
//     }

//     const students = await Student.find(query)
//       .populate("classId")
//       .populate("batchId")
//       .populate("subjectIds");
//       .skip(skip)
//         .limit(limit)
//         .sort({ createdAt: -1 }),

//     return NextResponse.json({ success: true, data: students });
//   } catch (error) {
//     console.log("error: ", error);
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

// 📥 GET ALL STUDENTS
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const all = searchParams.get("all") === "true";

    const cleanSearch = search.trim();

    let query: any = {};

    // For dropdown - return all students
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

    if (cleanSearch) {
      query = {
        $or: [
          { fullName: { $regex: cleanSearch, $options: "i" } },
          { contact: { $regex: cleanSearch, $options: "i" } },
        ],
      };
    }

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Get students + total count
    const [students, totalStudents] = await Promise.all([
      Student.find(query)
        .populate("classId")
        .populate("batchId")
        .populate("subjectIds")
        .skip(skip)
        .limit(limit),
      // .sort({ createdAt: -1 }),

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
    console.log("error: ", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
      },
      { status: 500 },
    );
  }
}
