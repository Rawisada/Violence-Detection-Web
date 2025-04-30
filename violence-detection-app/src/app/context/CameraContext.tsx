import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import useCameraRecorder from "@/app/hook/useCameraRecorder";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { uploadVideo } from "@/utils/uploadVideo";
import useDataCamera from "../hook/useDataCamera";
interface CameraContextType {
  cameraActive: boolean;
  toggleCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
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

  useEffect(() => {
    const init = async () => {
      if (!videoRef.current) {
          console.warn("videoRef ยังไม่พร้อม ต้องรอให้ mount ก่อน");
          return;
      }

      const isActive = await fetchCameraStatus(cameraId);
      if (typeof window !== "undefined" && (window as any).cameraStream) {
        console.log("กล้องเปิดอยู่แล้ว, ไม่ต้องเปิดใหม่");
        streamRef.current = (window as any).cameraStream;
        videoRef.current!.srcObject = streamRef.current;
        setCameraActive(true);
      } else if (isActive) {
        console.log("เปิดกล้อง");
        await startCamera();
      } else {
        console.log("ไม่เปิดกล้องอัตโนมัติ");
      }

    };

    init();
  }, []);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
        console.log(1);
      if (streamRef.current) {
          console.log(2);
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      (window as any).cameraStream = stream; 
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log(3);
      }
      await updateCameraStatus(cameraId, true);
      setCameraActive(true);
      startRecording();
    } catch (error) {
        console.error("Cannot access camera:", error);
    }
  };

  const stopCamera = async (forceClose: boolean = false) => {
    if (!forceClose) {
      console.warn("ไม่ปิดกล้อง เพราะต้องเปิดตลอด");
      return;
    }

    if (recorderRef.current) {
      recorderRef.current.stop();
    }

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
  
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }


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
        if (e.data.size > 0) {
            chunks.push(e.data);
        }
    };

    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      const fixedBlob = await fixVideoMetadata(videoBlob); 
      await uploadVideo(fixedBlob);

      if (cameraActive) {
        startRecording();  
      }
    };

    recorder.start(1000); 
    setTimeout(() => {
        recorder.stop();
    }, 60 * 1000);
  };



  const toggleCamera = async () => {
    console.log("Toggle Camera Clicked | ก่อนเปลี่ยนค่า cameraActive:", cameraActive);

    if (cameraActive) {
      console.log("ปิดกล้อง");
      await stopCamera(true)
    } else {
      console.log("เปิดกล้อง");
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
        style={{
          display: "none", 
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
      />
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCameraContext must be used within a CameraProvider");
  }
  return context;
};
