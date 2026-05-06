import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admission from "@/models/admission";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    console.log("formData: ", formData);

    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    const saved = await Admission.create({ data });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
