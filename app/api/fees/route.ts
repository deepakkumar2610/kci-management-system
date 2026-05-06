import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Fee from "@/models/Fee";

// ➕ CREATE / UPDATE FEES
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { classId, annualFees, installmentsAllowed } = body;

    if (!classId || !annualFees) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 },
      );
    }

    // 🔥 Upsert (update if exists)
    const fee = await Fee.findOneAndUpdate(
      { classId },
      { annualFees, installmentsAllowed },
      { new: true, upsert: true },
    );

    return NextResponse.json({ success: true, data: fee });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 📥 GET FEES BY CLASS
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const classId = req.nextUrl.searchParams.get("classId");

    const fee = await Fee.findOne({ classId });

    return NextResponse.json({ success: true, data: fee });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
