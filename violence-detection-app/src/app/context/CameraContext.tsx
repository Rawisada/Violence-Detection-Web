import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { uploadViolenceVideo } from "@/utils/uploadViolenceVideo";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { uploadVideo } from "@/utils/uploadVideo";
import useDataCamera from "../hook/useDataCamera";
import { getViolencePeron, getViolenceType } from "@/constants/violenceType";

interface CameraContextType {
  cameraActive: boolean;
  toggleCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchCameraStatus, updateCameraStatus } = useDataCamera();
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(
    (typeof window !== "undefined" && (window as any).cameraStream) || null
  );
  const recorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const cameraId = 1;
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blobsRef = useRef<Blob[]>([]);
  const cameraActiveRef = useRef(cameraActive);
  const [hasGap , sethasGap] = useState<boolean>(true);
  const hasGapRef = useRef<boolean>(true);

  const detectViolence = async (videoBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", videoBlob, "recorded_video.mp4");
  
      const res = await fetch("http://127.0.0.1:8001/detect", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        return { violence: false };
      }
  
      const result = await res.json();
      return result;
    } catch (err) {
      
      return { violence: false };
    }
  };
  

  useEffect(() => {
    const init = async () => {
      if (!videoRef.current) {
        console.warn("videoRef ยังไม่พร้อม ต้องรอให้ mount ก่อน");
        return;
      }

      const isActive = await fetchCameraStatus(cameraId);
      if (typeof window !== "undefined" && (window as any).cameraStream) {
        streamRef.current = (window as any).cameraStream;
        videoRef.current!.srcObject = streamRef.current;
        setCameraActive(true);
      } else if (isActive) {
        await startCamera();
      }
    };

    init();
  }, []);

  useEffect(() => {
    cameraActiveRef.current = cameraActive;
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      (window as any).cameraStream = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      await updateCameraStatus(cameraId, true);
      setCameraActive(true);
      startRecording();
    } catch (error) {
      console.error("Cannot access camera:", error);
    }
  };

  const updateHasGap = (value: boolean) => {
    sethasGap(value);
    hasGapRef.current = value;
  };
  

  const stopCamera = async (forceClose: boolean = false) => {
    if (!forceClose) {
      console.warn("ไม่ปิดกล้อง เพราะต้องเปิดตลอด");
      return;
    }

    if (recorderRef.current) {
      recorderRef.current.stop();
    }

    if (recordingIntervalRef.current) clearTimeout(recordingIntervalRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      (window as any).cameraStream = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    await updateCameraStatus(cameraId, false);
    setCameraActive(false);
  };

  const fixVideoMetadata = async (videoBlob: Blob): Promise<Blob> => {
    const ffmpeg = new FFmpeg();
    if (!ffmpeg.loaded) await ffmpeg.load();

    const inputFileName = "input.mp4";
    const outputFileName = "output.mp4";
    const videoData = new Uint8Array(await videoBlob.arrayBuffer());

    await ffmpeg.writeFile(inputFileName, videoData);
    await ffmpeg.exec(["-i", inputFileName, "-movflags", "faststart", "-c", "copy", outputFileName]);
    const data = await ffmpeg.readFile(outputFileName);
    return new Blob([data], { type: "video/mp4" });
  };

  const startRecording = () => {
    if (!streamRef.current) {
      console.error("ไม่มี stream สำหรับอัดวิดีโอ");
      return;
    }


    const options = { mimeType: "video/webm; codecs=vp9" };
    const recorder = new MediaRecorder(streamRef.current, options);
    recorderRef.current = recorder;
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      const fixedBlob = await fixVideoMetadata(videoBlob);
      await uploadVideo(fixedBlob);

      const detectionResult = await detectViolence(fixedBlob);
      console.log("Violence", detectionResult)

      if (detectionResult?.violence) {
        console.log("hasGap", hasGapRef.current)
        const labels = detectionResult.bhr_results?.map((r: any) => r.label) || [];
        const type = getViolenceType(labels);
        const person = getViolencePeron(labels);
        await uploadViolenceVideo(fixedBlob, {
          startTime: new Date(),
          type,
          person,
          camera: 1,
          fileSize: fixedBlob.size / 1024 / 1024,
          hasGap: hasGapRef.current,
        });
        updateHasGap(false);
      } else {
        updateHasGap(true);
      }
      
      console.log("cameraActiveRef.current", cameraActiveRef.current);
      if (cameraActiveRef.current) {
        startRecording();
      }
    };

    recorder.start();
    setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop(); 
      }
    }, 6000); // 5 วินาที
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      await stopCamera(true);
    } else {
      await startCamera();
    }
  };

  return (
    <CameraContext.Provider value={{ cameraActive, toggleCamera, videoRef }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none", position: "absolute", top: "-9999px", left: "-9999px" }}
      />
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error("useCameraContext must be used within a CameraProvider");
  return context;
};
