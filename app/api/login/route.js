import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  // Dummy user (replace with DB later)
  if (username === "admin" && password === "1234") {
    const token = signToken({ username });

    const response = NextResponse.json({
      message: "Login successful",
    });

    // Store token in cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
