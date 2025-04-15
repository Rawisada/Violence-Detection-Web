import { getCurrentDate } from "@/constants/todayDate";
export const uploadVideo = async (videoBlob: Blob) => {
    const today = getCurrentDate()
    // const now = new Date().toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "-");
    // const videoName = `video_${today}_${now}`;
    const videoName = `video_${today}`;
    const videoPath = `/weeklyVideos/${videoName}.mp4`;

    const formData = new FormData();
    formData.append("videoName", `${videoName}.mp4`);

    const checkFileResponse = await fetch(`/api/checkFile?videoName=${videoName}`);
    const fileExists = await checkFileResponse.json();
    console.log(fileExists.exists);

    if (fileExists.exists) {
        formData.append("video", videoBlob, `${videoName}_new.mp4`);
        
        const mergeResponse = await fetch("/api/mergeVideos", {
            method: "POST",
            body: formData,
        });

        if (!mergeResponse.ok) {
            throw new Error("การรวมวิดีโอล้มเหลว");
        }

    } else {
        console.log("ไม่มีไฟล์เดิม อัปโหลดไฟล์ใหม่...");
        formData.append("video", videoBlob, `${videoName}.mp4`);
        
        const uploadResponse = await fetch("/api/uploadFile", {
            method: "POST",
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error("Upload failed");
        }
    }

    const fileSizeInMB = (videoBlob.size / (1024 * 1024)).toFixed(2);

    const metaData = {
        videoName,
        date: today,
        videoPath,
        camera: 1,
        fileSize: Number(fileSizeInMB),
    };

    const method = fileExists.exists ? "PUT" : "POST";

    const saveResponse = await fetch("/api/weeklyVideos", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metaData),
    });

    const saveResult = await saveResponse.json();

    if (saveResult.success) {
        console.log("Video metadata saved:", saveResult.data);
    } else {
        console.error("Failed to save video metadata:", saveResult.error);
        throw new Error(`Failed to save metadata: ${saveResult.error}`);
    }

};
