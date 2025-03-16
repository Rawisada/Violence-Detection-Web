import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Camera from "@/models/Camera";

// GET: ดึงข้อมูลตามวัน
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("camera"); 

  try {
    let data;
    if (date) {
      data = await Camera.find({ date }).sort({ createdAt: -1 });
    } else {
      data = await Camera.find().sort({ createdAt: -1 });
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
    
    if (!body.camera || !body.name || !body.ip || typeof body.status !== 'boolean'
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCamera = await Camera.create(body);
    return NextResponse.json({ success: true, data: newCamera }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
