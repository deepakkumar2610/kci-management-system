import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Batch from "@/models/Batch";

// ➕ CREATE BATCH
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const batch = await Batch.create(body);

    return NextResponse.json({ success: true, data: batch });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 📥 GET BATCHES BY CLASS
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const classId = req.nextUrl.searchParams.get("classId");

    const batches = await Batch.find({ classId });

    return NextResponse.json({ success: true, data: batches });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
