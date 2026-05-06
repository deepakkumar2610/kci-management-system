import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subject from "@/models/Subjects";

// ➕ CREATE SUBJECT
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const subject = await Subject.create(body);

    return NextResponse.json({ success: true, data: subject });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 📥 GET SUBJECTS BY CLASS
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const classId = req.nextUrl.searchParams.get("classId");

    const subjects = await Subject.find({ classId });

    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
