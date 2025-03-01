import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WeeklyVideos from "@/models/WeeklyVideos";


export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const camera = searchParams.get("camera")?.split(",");

  try {
    let filter: any = {};

    if (date) filter.date = date;
    if (camera) filter.camera = camera;

    const data = await WeeklyVideos.find(filter).sort({ createdAt: -1 });

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
    
    if (!body.videoName || !body.date || !body.videoPath || !body.camera || !body.fileSize) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newWeeklyVideos = await WeeklyVideos.create(body);
    return NextResponse.json({ success: true, data: newWeeklyVideos }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
