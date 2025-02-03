import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGODB_URI", MONGODB_URI)
console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID)
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // ใช้ global เพื่อป้องกันการเชื่อมต่อซ้ำใน development
  if (!(global as any)._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // ใช้เชื่อมต่อใหม่ใน production
  clientPromise = new MongoClient(MONGODB_URI).connect();
}

export default clientPromise;
