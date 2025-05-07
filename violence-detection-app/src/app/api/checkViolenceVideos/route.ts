import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const videoName = url.searchParams.get("videoName");

    if (!videoName) {
        return NextResponse.json({ success: false, error: "Missing videoName" }, { status: 400 });
    }

    const videoPath = path.join(process.cwd(), "public/violenceVideos", `${videoName}.mp4`);

    const fileExists = fs.existsSync(videoPath);

    return NextResponse.json({ exists: fileExists });
}
