import { useRef, useState, useEffect } from "react";
import { uploadVideo } from "@/utils/uploadVideo";

export const useCameraRecorder = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        startRecording(stream);
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;

        stopRecording();
    };

    const startRecording = (stream: MediaStream) => {
        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;

        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: "video/mp4" });
            await uploadVideo(blob);  // ส่งไปอัปโหลด
        };

        recorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        recorderRef.current?.stop();
        setRecording(false);
    };

    useEffect(() => {
        startCamera();  // เปิดกล้องอัตโนมัติเมื่อโหลดหน้า
        return () => stopCamera();  // ปิดกล้องเมื่อออกจากหน้า
    }, []);

    return { videoRef, recording, startCamera, stopCamera };
};
