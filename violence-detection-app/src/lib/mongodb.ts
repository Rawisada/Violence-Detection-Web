
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// ใช้ global cache เพื่อหลีกเลี่ยงการสร้าง connection ซ้ำใน development mode
let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "violence_detection", // 🔹 เปลี่ยนเป็นชื่อ database ที่ต้องการ
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// เก็บ connection ไว้ใน global เพื่อป้องกันการเชื่อมต่อซ้ำในโหมด Development
(global as any).mongoose = cached;

export default dbConnect;
