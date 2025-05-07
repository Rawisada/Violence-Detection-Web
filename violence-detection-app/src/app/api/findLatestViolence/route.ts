import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Violence from "@/models/Violence"; // ← โมเดล MongoDB ที่ใช้

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix");

  if (!prefix) {
    return NextResponse.json({ success: false, error: "Missing prefix" }, { status: 400 });
  }

  try {
    const latest = await Violence.find({
      videoName: { $regex: `^${prefix}` },
    })
      .sort({ time: -1 })  // เรียงตามเวลาล่าสุด
      .limit(1);

    if (latest.length === 0) {
      return NextResponse.json(null);  // ไม่เจอ → กลับเป็น null
    }

    const item = latest[0];

    return NextResponse.json({
      videoName: item.videoName,
      time: item.time,
      type: item.type,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
