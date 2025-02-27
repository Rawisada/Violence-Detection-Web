import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useViolenceData from "@/app/hook/useDataLiveFeed";
import { Button } from "@mui/material";


const LiveFeedComponent: React.FC = () => {

  const { data, loading, error } = useViolenceData();
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const streamRef = useRef<MediaStream | null>(null);

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

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

   const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream; 
        }
      }, 100);

      setCameraActive(true);
    } catch (error) {
      console.error("Cannot access camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop()); 
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null; 
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "92.8vh",
        backgroundColor: "#f9f9f9",
        padding: "0 !important",
        m: 0
      }}
    >
      <Box sx={{ flex: 6, borderRight: "1px solid #ccc", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", padding: "0 !important"}}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#e0e0e0",
          }}
        >
          {cameraActive ? (
            <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Typography variant="subtitle1" sx={{ color: "#000000" }}>
              Camera is not available
            </Typography>
          )}
        </Box>
        <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#fff", position: "absolute", m:2, display: "flex", right:0, borderRadius: "10px"}}>
          <Typography variant="body2"  sx={{ color: "#000000"}}>{currentDateTime}</Typography>
        </Box>
        <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#fff", position: "absolute", m:2, display: "flex", left:0, borderRadius: "10px"}}>
          <Typography variant="body2"  sx={{ color: "#000000"}}>CAM 01</Typography>
        </Box>
        <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "#fff", color: "#fff", textAlign: "center", py: 1 }}>
          <Typography variant="body2" sx={{ color: "#000000"}}>CAM 01</Typography>
        </Box>
        <Button
          variant="contained"
          color={cameraActive ? "error" : "primary"}
          onClick={cameraActive ? stopCamera : startCamera}
          sx={{
            position: "absolute",
            bottom: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          {cameraActive ? "ปิดกล้อง" : "เปิดกล้อง"}
        </Button>

      </Box>

      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#000000"}}>
          Violence Detected
        </Typography>
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {data.map((item, index) => (
            <Card key={index} sx={{ mb: 1 }}>
              <CardContent sx={{ display: "flex", alignItems: "center",  padding: "10px !important"}}>
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    backgroundColor: "#e0e0e0",
                    mr: 2,
                    borderRadius: "4px"
                  }}
                ></Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    Violence: <strong>{item.type}</strong>
                  </Typography>
                  <Typography variant="body2">Date: {item.date}</Typography>
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
