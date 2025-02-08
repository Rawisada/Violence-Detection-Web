import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await dbConnect();
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      dbName: db.databaseName,
      collections: collections.map((col: { name: any; }) => col.name),
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
