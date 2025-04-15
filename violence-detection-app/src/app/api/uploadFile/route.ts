import { writeFile } from 'fs/promises';
import path from 'path';
import { getCurrentDate } from "@/constants/todayDate";
import fs from 'fs';

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;
    const fileName = formData.get('videoName') as string | null;

    if (!file || !fileName) {
        return new Response(JSON.stringify({ success: false, error: 'No file uploaded or missing fileName' }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const videosDir = path.join(process.cwd(), "public/weeklyVideos");
    if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
    }

    const filePath = path.join(videosDir, fileName);

    await writeFile(filePath, buffer);

    return new Response(JSON.stringify({
        success: true,
        path: `/weeklyVideos/${fileName}`
    }), { status: 200 });
}




