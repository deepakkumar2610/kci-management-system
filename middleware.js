// import { NextResponse } from "next/server";
// import { verifyToken } from "./lib/auth";

// export function middleware(req) {
//   console.log("Middleware running...");
//   const token = req.cookies.get("token")?.value;
//   console.log("token: ", token);

//   const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

//   if (isDashboard) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     const verified = verifyToken(token);

//     if (!verified) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
