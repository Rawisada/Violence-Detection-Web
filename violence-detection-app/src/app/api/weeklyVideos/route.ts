import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WeeklyVideos from "@/models/WeeklyVideos";


// export async function GET(req: Request) {
//   await dbConnect();
//   const { searchParams } = new URL(req.url);
//   const date = searchParams.get("date");
//   const camera = searchParams.get("camera")?.split(",");

//   try {
//     let filter: any = {};

//     if (date) filter.date = date;
//     if (camera) filter.camera = camera;

//     const data = await WeeklyVideos.find(filter).sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const videoName = searchParams.get("videoName");
  const date = searchParams.get("date");
  const camera = searchParams.get("camera")?.split(",");

  try {
    let filter: any = {};

    if (videoName) {
      filter.videoName = videoName;
    } else {
      if (date) filter.date = date;
      if (camera) filter.camera = { $in: camera };
    }

    const data = await WeeklyVideos.find(filter).sort({ createdAt: -1 });

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
    const { videoName, date, videoPath, camera, fileSize } = body;
    
    if (!videoName || !date || !videoPath || camera === undefined || fileSize === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newVideo = await WeeklyVideos.create({ videoName, date, videoPath, camera, fileSize });
    return NextResponse.json({ success: true, data: newVideo }, { status: 201 });
  } catch (error) {
      return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }

}

// PUT: เพิ่มข้อมูลใหม่
export async function PUT(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { videoName, date, videoPath, camera, fileSize } = body;

    if (!videoName || !date || !videoPath || camera === undefined || fileSize === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const existingVideo = await WeeklyVideos.findOne({ videoName });

    if (!existingVideo) {
      return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
    }

    
    const updatedVideo = await WeeklyVideos.findOneAndUpdate(
      { videoName },
      { date, videoPath, camera, fileSize },
      { new: true } 
    );

    return NextResponse.json({ success: true, data: updatedVideo }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}