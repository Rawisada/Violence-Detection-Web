// import { getCurrentDate } from "@/constants/todayDate";


// interface UploadMeta {
//     startTime: Date | null;
//     type: number[];
//     camera: number;
//     fileSize: number;
//     hasGap: boolean,
//   }

// export const uploadViolenceVideo = async (videoBlob: Blob, meta: UploadMeta) => {
//     const today = getCurrentDate();
//     const now = new Date();
//     const time = now.toTimeString().split(" ")[0];
//     // {camera no.}_{yyyy-mm-dd}_{hh:mm:ss}.mp4
//     const videoName = `cam1_${today}_${time}`;
//     const videoPath = `/violenceVideos/${videoName}.mp4`;
//     const basePrefix = `cam${meta.camera}_${today}`

//     const formData = new FormData();
//     formData.append("videoName", `${videoName}.mp4`);

//     const checkFileResponse = await fetch(`/api/checkViolenceVideos?videoName=${videoName}`);
//     const fileExists = await checkFileResponse.json();

//     if (fileExists.exists) {
//         formData.append("video", videoBlob, `${videoName}_new.mp4`);
        
//         const mergeResponse = await fetch("/api/mergeViolenceVideos", {
//             method: "POST",
//             body: formData,
//         });

//         if (!mergeResponse.ok) {
//             throw new Error("การรวมวิดีโอล้มเหลว");
//         }

//     } else {
//         console.log("ไม่มีไฟล์เดิม อัปโหลดไฟล์ใหม่...");
//         formData.append("video", videoBlob, `${videoName}.mp4`);
        
//         const uploadResponse = await fetch("/api/uploadViolenceFile", {
//             method: "POST",
//             body: formData,
//         });

//         if (!uploadResponse.ok) {
//             throw new Error("Upload failed");
//         }
//     }

//     const fileSizeInMB = (videoBlob.size / (1024 * 1024)).toFixed(2);

//     const metaData = {
//         videoName,
//         date: today,
//         time: time,
//         videoPath,
//         camera: 1,
//         fileSize: Number(fileSizeInMB),
//         type: meta.type,
//     };

//     const method = fileExists.exists ? "PUT" : "POST";

//     const saveResponse = await fetch("/api/violence", {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(metaData),
//     });

//     const saveResult = await saveResponse.json();

//     if (saveResult.success) {
//         console.log("Video metadata saved:", saveResult.data);
//     } else {
//         console.error("Failed to save video metadata:", saveResult.error);
//         throw new Error(`Failed to save metadata: ${saveResult.error}`);
//     }

// };


import { getCurrentDate } from "@/constants/todayDate";

interface UploadMeta {
  startTime: Date | null;
  type: number;
  person: number[];
  camera: number;
  fileSize: number;
  hasGap: boolean;
}

export const uploadViolenceVideo = async (videoBlob: Blob, meta: UploadMeta) => {
  const today = getCurrentDate();
  const now = new Date();
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  const basePrefix = `CAM${meta.camera}_${today}`; // เช่น cam1_2025-04-17

  let mergeWithPrevious = false;
  let originalVideoName = "";

  console.log("hasGapsssss", meta.hasGap)

  // ใช้ hasGap เป็นตัวตัดสิน
  if (!meta.hasGap) {
    // เรียก backend เพื่อค้นหาวิดีโอล่าสุด
    const latestCheck = await fetch(`/api/findLatestViolence?prefix=${basePrefix}`);
    const latest = await latestCheck.json();
    console.log("latest", latest)

    if (latest?.videoName) {
      mergeWithPrevious = true;
      originalVideoName = latest.videoName;
      if (typeof latest?.type === "number" && latest.type < meta.type) {
        console.log("update", meta.type, "to", latest.type )
        meta.type = latest.type;
      }
    }
  }

  const videoName = mergeWithPrevious
    ? `${originalVideoName}_new`
    : `CAM${meta.camera}_${today}_${time}`;
  const videoPath = `/violenceVideos/${videoName}.mp4`;

  const formData = new FormData();
  formData.append("videoName", `${videoName}.mp4`);
  formData.append("video", videoBlob, `${videoName}.mp4`);

  // if (mergeWithPrevious) {
  //   const metaRes = await fetch(`/api/violence?videoName=${originalVideoName}`);
  //   const metaJson = await metaRes.json();
  //   console.log("metaJson",metaJson.data[0])
  //   if (metaRes.ok && metaJson?.type) {
  //     console.log("metaJson.type",metaJson.data[0].type)
  //     if(metaJson.data[0].type < meta.type){
  //       meta.type = metaJson.data[0].type
  //     }
  //   }
  //  }

  if (mergeWithPrevious) {
    const mergeResponse = await fetch("/api/mergeViolenceVideos", {
      method: "POST",
      body: formData,
    });

    if (!mergeResponse.ok) {
      throw new Error("การรวมวิดีโอล้มเหลว");
    }
  } else {
    const uploadResponse = await fetch("/api/uploadViolenceFile", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("อัปโหลดวิดีโอล้มเหลว");
    }
  }

  const fileSizeInMB = (videoBlob.size / (1024 * 1024)).toFixed(2);

  const metaData = {
    videoName: mergeWithPrevious ? originalVideoName : videoName,
    date: today,
    time,
    person: meta.person,
    videoPath,
    camera: meta.camera,
    fileSize: Number(fileSizeInMB),
    type: meta.type,
  };

  const method = mergeWithPrevious ? "PUT" : "POST";

  const saveResponse = await fetch("/api/violence", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metaData),
  });

  const saveResult = await saveResponse.json();

  if (saveResult.success) {
    console.log("Metadata saved:", saveResult.data);
  } else {
    console.error("Metadata save failed:", saveResult.error);
    throw new Error(`Failed to save metadata: ${saveResult.error}`);
  }
};
