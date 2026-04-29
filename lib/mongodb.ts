import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null };

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using existing DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGO_URI!, {
      dbName: "kci-management",
    });
  }

  cached.conn = await cached.promise;

  console.log("✅ MongoDB Connected Successfully");

  return cached.conn;
}
