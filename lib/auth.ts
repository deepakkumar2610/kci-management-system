import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET_KEY as string;

if (!SECRET) {
  throw new Error("JWT_SECRET_KEY is not defined");
}

// Define your payload structure
type AuthPayload = {
  id: string;
  username: string;
};

// 🔐 Sign Token
export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

// 🔍 Verify Token
export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload & AuthPayload;

    return {
      id: decoded.id,
      username: decoded.username,
    };
  } catch (err) {
    console.log("JWT Error:", err);
    return null;
  }
}
