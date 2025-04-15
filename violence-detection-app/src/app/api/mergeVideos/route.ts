import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {       
        const formData = await req.formData();
        const videoName = formData.get("videoName") as string | null;
        const newVideo = formData.get("video") as File | null;

        if (!videoName || !newVideo) {
            return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
        }

        const videosDir = path.join(process.cwd(), "public/weeklyVideos");
        if (!fs.existsSync(videosDir)) {
            fs.mkdirSync(videosDir, { recursive: true });
        }

        const videoPath = path.resolve(videosDir, videoName);  
        const tempPath = path.resolve(videosDir, `${videoName}_new.mp4`);  
        const mergedPath = path.resolve(videosDir, `${videoName}_merged.mp4`);  
        const fileListPath = path.resolve(videosDir, "file_list.txt"); 

        const arrayBuffer = await newVideo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.length === 0) {
            return NextResponse.json({ success: false, error: "New video data is empty" }, { status: 400 });
        }

        fs.writeFileSync(tempPath, buffer);

        if (!fs.existsSync(videoPath)) {
            console.warn(`⚠️ ไม่มีไฟล์ต้นฉบับ ${videoPath}, ใช้ไฟล์ใหม่แทน`);
            fs.renameSync(tempPath, videoPath);  
            return NextResponse.json({ success: true, message: "New video saved successfully" });
        }

        const fileListContent = `file '${videoPath}'\nfile '${tempPath}'\n`;
        fs.writeFileSync(fileListPath, fileListContent);

        const ffmpegPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe");
        if (!fs.existsSync(ffmpegPath)) {
            console.error(`❌ ffmpeg-static path does not exist: ${ffmpegPath}`);
            return NextResponse.json({ success: false, error: "FFmpeg path not found" }, { status: 500 });
        }

        console.log(`✅ Using ffmpeg from: ${ffmpegPath}`);

        await new Promise((resolve, reject) => {
            const command = `"${ffmpegPath}" -f concat -safe 0 -i "${fileListPath}" -movflags faststart -c copy "${mergedPath}"`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("❌ ffmpeg error:", stderr);
                    reject(NextResponse.json({ success: false, error: "Failed to merge videos" }, { status: 500 }));
                } else {
                    console.log("✅ ffmpeg output:", stdout);
                    resolve(true);
                }
            });
        });

        fs.renameSync(mergedPath, videoPath);

        fs.unlinkSync(tempPath);
        fs.unlinkSync(fileListPath);

        return NextResponse.json({ success: true, message: "Videos merged successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
