import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Violence from "@/models/Violence";

// GET: ดึงข้อมูลตามวัน
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // ดึง query parameter `date`

  try {
    let data;
    if (date) {
      data = await Violence.find({ date }).sort({ createdAt: -1 });
    } else {
      data = await Violence.find().sort({ createdAt: -1 });
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// POST: เพิ่มข้อมูลใหม่
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    
    if (!body.videoName || !body.type || !body.date || !body.time || !body.videoLink) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newViolence = await Violence.create(body);
    return NextResponse.json({ success: true, data: newViolence }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
