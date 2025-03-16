import { writeFile } from 'fs/promises';
import path from 'path';
import { getCurrentDate } from "@/constants/todayDate";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;
    const today = getCurrentDate()

    if (!file) {
        return new Response(JSON.stringify({ success: false, error: 'No file uploaded' }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `video_${today}.mp4`;
    const filePath = path.join(process.cwd(), 'public/weeklyVideos', fileName);

    await writeFile(filePath, buffer);

    return new Response(JSON.stringify({
        success: true,
        path: `/weeklyVideos/${fileName}`
    }), { status: 200 });
}




