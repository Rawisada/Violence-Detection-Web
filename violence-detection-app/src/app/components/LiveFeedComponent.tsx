import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useViolenceData from "@/app/hook/useDataLiveFeed";
import { Button } from "@mui/material";
import { VIOLENCE_TYPES } from "@/constants/violenceType";
import { formatDate } from "@/lib/formate";
import useDataCamera from "../hook/useDataCamera";
import { uploadVideo } from "@/utils/uploadVideo";
import { useCameraContext } from "../context/CameraContext";
const LiveFeedComponent: React.FC = () => {
  const { data, loading, error } = useViolenceData();
  const { fetchCameraStatus, updateCameraStatus } = useDataCamera()
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const { cameraActive, toggleCamera , videoRef} = useCameraContext();
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const cameraId = 1; 

  useEffect(() => {
    const updateDateTime = () => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString("en-GB", {
            timeZone: "Asia/Bangkok",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).replace(",", "");
        setCurrentDateTime(formattedDateTime);
    };
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // const loadCameraStatus = async () => {
  //   const isActive = await fetchCameraStatus(cameraId);
  //   setCameraActive(isActive);

  //   if (isActive) {
  //     await startCamera();
  //   } else {
  //       stopCamera();
  //   }
  // };

  // const startCamera = async () => {
  //   try {
  //       if (streamRef.current) {
  //           streamRef.current.getTracks().forEach(track => track.stop());
  //           streamRef.current = null;
  //       }
        
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //       streamRef.current = stream;

  //       if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //       } else {
  //           console.warn("videoRef ยังไม่พร้อมตอน startCamera");
  //       }

  //       await updateCameraStatus(cameraId, true);
  //       setCameraActive(true);
  //       startRecording();
  //   } catch (error) {
  //       console.error("Cannot access camera:", error);
  //   }
  // };


  // const stopCamera = async () => {
  //   recorderRef.current?.stop();
  //   streamRef.current?.getTracks().forEach(track => track.stop());
  //   streamRef.current = null;

  //   if (videoRef.current) {
  //       videoRef.current.srcObject = null;
  //   }

  //   await updateCameraStatus(cameraId, false);
  //   setCameraActive(false);
  // };

  // const fixVideoMetadata = async (videoBlob: Blob): Promise<Blob> => {
  //   if (!ffmpeg.loaded) await ffmpeg.load();

  //   const inputFileName = "input.mp4";
  //   const outputFileName = "output.mp4";

  //   const videoData = new Uint8Array(await videoBlob.arrayBuffer());

  //   await ffmpeg.writeFile(inputFileName, videoData); 
  //   await ffmpeg.exec(["-i", inputFileName, "-movflags", "faststart", "-c", "copy", outputFileName]); 
    
  //   const data = await ffmpeg.readFile(outputFileName); 
  //   return new Blob([data], { type: "video/mp4" });
  // };

  // const startRecording = () => {
  //   if (!streamRef.current) {
  //       console.error("ไม่มี stream สำหรับอัดวิดีโอ");
  //       return;
  //   }

  //   const options = { mimeType: "video/webm; codecs=vp9" }; 
  //   const recorder = new MediaRecorder(streamRef.current, options);
  //   recorderRef.current = recorder;
  //   const chunks: Blob[] = [];

  //   recorder.ondataavailable = (e) => {
  //       if (e.data.size > 0) {
  //           chunks.push(e.data);
  //       }
  //   };

  //   recorder.onstop = async () => {
  //       const videoBlob = new Blob(chunks, { type: "video/webm" });
  //       const fixedBlob = await fixVideoMetadata(videoBlob); 
  //       await uploadVideo(fixedBlob);

  //       if (cameraActive) {
  //           startRecording();  
  //       }
  //   };

  //   recorder.start(1000); 
  //   setTimeout(() => {
  //       recorder.stop();
  //   }, 60 * 1000);
  // };


  // useEffect(() => {
  //   loadCameraStatus();
  // }, []);

  // useEffect(() => {
  //   const init = async () => {
  //       const isActive = await fetchCameraStatus(cameraId);
  //       setCameraActive(isActive);

  //       if (isActive) {
  //           await startCamera();
  //       } else {
  //           await stopCamera();
  //       }
  //   };
  //   init();
  // }, []);

  // useEffect(() => {
  //     if (cameraActive && streamRef.current && videoRef.current) {
  //         videoRef.current.srcObject = streamRef.current;
  //     }
  // }, [cameraActive]);

  // useEffect(() => {
  //     const init = async () => {
  //         if (!videoRef.current) {
  //             console.warn("❌ videoRef ยังไม่พร้อม ต้องรอให้ mount ก่อน");
  //             return;
  //         }
  
  //         const isActive = await fetchCameraStatus(cameraId);
  //         // setCameraActive(isActive);
  //         if (isActive) {
  //             await startCamera();
  //         } else {
  //             await stopCamera();
  //         }
  //     };
  
  //     init();
  // }, []);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "92.8vh",
        backgroundColor: "#fafafa",
        padding: "0 !important",
        m: 0
      }}
    >
      <Box sx={{ flex: 6, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", padding: "0 !important"}}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fafafa",
            maxHeight: "480px"
          }}
        >
          {cameraActive ? (
            ""
          ) : (
            <Typography variant="subtitle1" sx={{ color: "#000000" }}>
              Camera is not available
            </Typography>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              borderRadius: 16, 
              padding: 10,
              display: cameraActive ? "block" : "none" 
            }} 
          />
        </Box>
        <Box sx={{ textAlign: "center", p: 1, position: "absolute", m:2, display: "flex", right:0, fontSize: 12}}>
          <Typography variant="body2"  sx={{ color: "#ffffff"}}>{currentDateTime}</Typography>
        </Box>
        <Box sx={{ textAlign: "center", p: 1,  position: "absolute", m:2, display: "flex", left:0, fontSize: 12}}>
          <Typography variant="body2"  sx={{ color: "#ffff"}}>CAM 01</Typography>
        </Box>
        <Button
          variant="contained"
          color={cameraActive ? "error" : "primary"}
          onClick={toggleCamera}
          sx={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          {cameraActive ? "ปิดกล้อง" : "เปิดกล้อง"}
        </Button>

      </Box>

      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", p: 2 , backgroundColor: "#fafafa"}}>
        <Typography variant="h6" sx={{ mb: 2, color: "#000000", textAlign: "center"}}>
          Violence Detected
        </Typography>
        <Box sx={{ flex: 1, overflowY: "auto"}}>
          {data.map((item, index) => (
            <Card key={index} sx={{ mb: 1, background:"#ffffff"}}>
              <CardContent sx={{ display: "flex", alignItems: "center",  padding: "10px !important"}}>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    backgroundColor: "#fafafa",
                    mr: 2,
                    borderRadius: "4px"
                  }}
                ></Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    Violence: <strong>{VIOLENCE_TYPES[item.type]}</strong>
                  </Typography>
                  <Typography variant="body2">Date: {formatDate(item.date)}</Typography>
                  <Typography variant="body2">Time: {item.time}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LiveFeedComponent;
function fixBlobMetadata(videoBlob: Blob) {
  throw new Error("Function not implemented.");
}

