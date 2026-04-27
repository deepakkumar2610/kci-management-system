import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET_KEY;

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyToken(token) {
  try {
    console.log(token);
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.log(err);
    return null;
  }
}
