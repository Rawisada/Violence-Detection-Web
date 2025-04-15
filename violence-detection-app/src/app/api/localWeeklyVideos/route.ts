import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const videoName = url.searchParams.get("videoName");

        if (!videoName) {
            return NextResponse.json({ success: false, error: "Missing videoName" }, { status: 400 });
        }

        const videoPath = path.join(process.cwd(), "public/weeklyVideos", videoName);

        if (!fs.existsSync(videoPath)) {
            return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
        }

        // ✅ เปิดไฟล์วิดีโอเป็น Stream
        const fileStream = fs.createReadStream(videoPath);

        return new Response(new ReadableStream({
            start(controller) {
                fileStream.on("data", (chunk) => controller.enqueue(chunk));
                fileStream.on("end", () => controller.close());
                fileStream.on("error", (err) => controller.error(err));
            },
        }), {
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": `inline; filename="${videoName}"`,
            },
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to stream video" }, { status: 500 });
    }
}
