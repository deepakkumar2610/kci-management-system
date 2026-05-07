import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";

// ➕ CREATE CLASS
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const newClass = await Class.create(body);

    return NextResponse.json({ success: true, data: newClass });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 📥 GET ALL CLASSES
export async function GET() {
  try {
    await connectDB();

    const classes = await Class.find();

    return NextResponse.json({ success: true, data: classes });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
