import { useState, useEffect } from "react";
import axios from "axios";
import { CameraData } from "../types/CameraTypes";

const useCameraRecorder = () => {
  const [data, setData] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRefs: Record<number, MediaStream | null> = {};
  const recorderRefs: Record<number, MediaRecorder | null> = {};

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/camera`);
      setData(response.data?.data?.sort((a: CameraData, b: CameraData) => a.camera - b.camera));
      setError(null);
    } catch (error) {
      setError("Failed to fetch camera data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCameraStatus = async (cameraId: number) => {
    try {
      const response = await axios.get(`/api/camera?camera=${cameraId}`);
      if (response.data.success && response.data.data.length > 0) {
        return response.data.data[0].status as boolean;
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch camera status:", error);
      return false;
    }
  };

  const updateCameraStatus = async (cameraId: number, status: boolean) => {
    try {
      await axios.put(`/api/camera/${cameraId}`, { status });
      if (status) {
        startRecording(cameraId);
      } else {
        stopRecording(cameraId);
      }
    } catch (error) {
      console.error("Failed to update camera status:", error);
    }
  };

  const startRecording = async (cameraId: number) => {
    try {
      if (streamRefs[cameraId]) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRefs[cameraId] = stream;
      
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });
      recorderRefs[cameraId] = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const videoBlob = new Blob(chunks, { type: "video/webm" });
        await axios.post("/api/uploadVideo", videoBlob);
      };

      recorder.start(1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = (cameraId: number) => {
    if (recorderRefs[cameraId]) {
      recorderRefs[cameraId]?.stop();
      recorderRefs[cameraId] = null;  // เคลียร์ค่าของ recorder
    }
  
    if (streamRefs[cameraId]) {
      // ✅ ปิดทุก track ที่เปิดอยู่
      streamRefs[cameraId]?.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
  
      streamRefs[cameraId] = null;  // เคลียร์ค่า stream
    }
  
    // if (videoRef.current) {
    //   videoRef.current.srcObject = null;  // ✅ รีเซ็ต videoRef
    // }
  
    console.log(`Camera ${cameraId} stopped`);
  };
  

  useEffect(() => {
    fetchCameras();
  }, []);

  return { data, loading, error, fetchCameras, fetchCameraStatus, updateCameraStatus, startRecording, stopRecording };
};

export default useCameraRecorder;
