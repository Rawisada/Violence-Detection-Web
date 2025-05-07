import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Violence from "@/models/Violence";

// GET: ดึงข้อมูลตามวัน
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const videoName = searchParams.get("videoName");
  const date = searchParams.get("date");
  const camera = searchParams.get("camera")?.split(",");
  const type = searchParams.get("type")?.split(",").map(Number); 

  try {
    let filter: any = {};
    if (videoName) {
      filter.videoName = videoName;
    } else {
      if (date) filter.date = date;
      if (camera) filter.camera = camera;
      if (type && type.length > 0) filter.type = { $in: type };
    }

    const data = await Violence.find(filter).sort({ createdAt: -1 });

     if (!data.length) {
        return NextResponse.json({ success: true, data: [], message: "Video not found" });
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
    
    if (!body.videoName || !body.type || !body.person || !body.date || !body.time || !body.videoPath || !body.camera || !body.fileSize) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newViolence = await Violence.create(body);
    return NextResponse.json({ success: true, data: newViolence }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}


export async function PUT(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { videoName, date, time, videoPath, camera, fileSize, type, person } = body;

    if (!videoName || !date || !time || !videoPath || camera === undefined || fileSize === undefined || !type || !person) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existingVideo = await Violence.findOne({ videoName });

    if (!existingVideo) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    const updatedVideo = await Violence.findOneAndUpdate(
      { videoName },
      { date, time, videoPath, camera, fileSize, type, person},
      { new: true }  // ให้คืนค่าที่อัปเดตแล้ว
    );

    return NextResponse.json({ success: true, data: updatedVideo }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
