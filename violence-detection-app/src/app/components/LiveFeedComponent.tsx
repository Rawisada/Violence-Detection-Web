import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useViolenceData from "@/app/hook/useDataLiveFeed";
import { Button, CircularProgress } from "@mui/material";
import { COLOR_MAP, VIOLENCE_OPTIONS, VIOLENCE_TYPES } from "@/constants/violenceType";
import { formatDate, formatTime } from "@/lib/formate";
import useDataCamera from "../hook/useDataCamera";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useCameraContext } from "../context/CameraContext";
import { useRouter } from "next/navigation";
const LiveFeedComponent: React.FC = () => {
  const { data, loading, error } = useViolenceData();
  const { fetchCameraStatus, updateCameraStatus } = useDataCamera()
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const { cameraActive, toggleCamera , videoRef} = useCameraContext();
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const cameraId = 1; 
  const router = useRouter();

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

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "row",
        height: "92.8vh",
        backgroundColor: "#fafafa",
        padding: "0 !important",
        m: 0
      }}
    >
      <Box sx={{ flex: 6, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", padding: "0 !important", marginY:2}}>
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
              marginRight: 10,
              display: cameraActive ? "block" : "none" 
            }} 
          />
        </Box>
        <Box sx={{ textAlign: "center", p: 1, position: "absolute", m:1, mr:3, display: "flex", right:0, fontSize: 12}}>
          <Typography variant="body2"  sx={{ color: "#ffffff"}}>{currentDateTime}</Typography>
        </Box>
        <Box sx={{ textAlign: "center", p: 1,  position: "absolute", m:1, display: "flex", left:0, fontSize: 12}}>
          <Typography variant="body2"  sx={{ color: "#ffff"}}>CAM 01</Typography>
        </Box>
        <Button
          variant="contained"
          color={cameraActive ? "error" : "primary"}
          onClick={toggleCamera}
          sx={{
            // position: "absolute",
            // bottom: "50px",
            // left: "50%",
            // transform: "translateX(-50%)",
            marginTop:3,
            maxWidth: 100,
            zIndex: 10,
            display: "block",
            mx: "auto",   
          }}
        >
          {cameraActive ? "Close Camera" : "Open Camera"}
        </Button>

      </Box>

      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", p: 2 , backgroundColor: "#EEEEEE", borderRadius: 3, marginY:2}}>
        <Typography variant="h6" sx={{ mb: 2, color: "#000000", textAlign: "center"}}>
          Violence Detected
        </Typography>
        <Box sx={{
            flex: 1,
            overflowY: "auto",
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f0f0',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c0c0c0',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#a0a0a0',
            },
            scrollbarWidth: 'thin',             
            scrollbarColor: '#c0c0c0 #f0f0f0', 
          }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center",  alignItems: "center",  height: "95%", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : data.length === 0 ? (
            <Typography variant="body1" align="center" color="gray" sx={{ mt: 2 , display: "flex", justifyContent: "center", alignItems: "center",  height: "95%",}}>
              No detection found
            </Typography>
          ) : (data.map((item, index) => (
            <Card key={index} sx={{ mb: 1, background:"#ffffff", marginRight:1}}>
              <CardContent sx={{ display: "flex", alignItems: "center",  padding: "10px !important"}}>
              <Box
                  sx={{
                    width: 90,
                    height: 90,
                    backgroundColor: "#fafafa",
                    mr: 2,
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}
                >
                  <video
                    src={item.videoPath}
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget;
                      video.currentTime = 0.1;
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    Type: :&nbsp;
                      <Typography component="span" sx={{ color: COLOR_MAP[item.type], fontWeight: "bold" }}>
                        {VIOLENCE_TYPES[item.type]}
                      </Typography>
                  </Typography>
                  <Typography variant="body2">Date: {formatDate(item.date)}</Typography>
                  <Typography variant="body2">Time: {formatTime(item.time)}</Typography>
                </Box>

                <Button
                  sx={{
                    minWidth: '30px',          
                    width: '30px',           
                    height: '30px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0, 
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  onClick={() => router.push(`/videoDetailViolence/${item.videoName}`)}
                >
                  <ArrowForwardIosIcon/>
                </Button>
              </CardContent>
            </Card>
          )
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LiveFeedComponent;

