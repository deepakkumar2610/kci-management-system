import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ClassModel from "@/models/Class";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // body = { gradeName: "10th", board: "SSC" }

    const newClass = await ClassModel.create({
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
