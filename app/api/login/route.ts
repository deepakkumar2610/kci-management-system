import { connectDB } from "../../../lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  await connectDB(); // connection happens HERE

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  console.log("isMatch: ", isMatch);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const token = signToken({
    id: admin._id,
    username: admin.username,
  });

  const res = NextResponse.json({ success: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return res;
}
