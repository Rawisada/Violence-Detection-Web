import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { WeeklyViodeosData } from "../types/WeeklyVideosTypes";
import { formatDate, formatFileSize, formatTime } from "@/lib/formate";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { ViolenceData } from "../types/ViolenceVideosTypes";
import { VIOLENCE_TYPES } from "@/constants/violenceType";
interface DetailViolenceVideosComponentProps {
  videoName: string;
}

const DetailViolenceVideosComponent: React.FC<DetailViolenceVideosComponentProps> = ({ videoName }) => {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<ViolenceData | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`/api/violence?videoName=${videoName}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setVideo(data.data[0]);
        } else {
          setError("Video not found");
        }
      } catch (err) {
        setError("Failed to load video");
      }
    };

    if (videoName) {
      fetchVideoDetails();
    }
  }, [videoName]);

  const handleDownloadClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDownload = () => {
    if (video?.videoPath) {
      const link = document.createElement("a");
      link.href = video.videoPath;
      link.setAttribute("download", video.videoName || "video.mp4");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setConfirmOpen(false);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Box 
        sx={{ p: 3, 
          minHeight:"92.8vh",
          backgroundColor: "#fafafa",
        }}>
        <Button onClick={() => router.back()} sx={{
          mb: 1,
          justifyContent: "flex-start",
          textTransform: "none",
          '&:hover': {
            backgroundColor: 'transparent',
          },
          left: "-15px",
        }}>
          <ChevronLeftIcon/>Back
        </Button>
        <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium'}}>Video Details</Typography>
        <div className="px-44">
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : video ? (
            <>
              <div className="flex justify-between">
                <div>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                  Camera No.: CAM {video.camera}
                </Typography>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                  Date: {formatDate(video.date)}
                </Typography>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                  Time: {formatTime(video.time)}
                </Typography>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                  Type: {VIOLENCE_TYPES[video.type]}
                </Typography>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                  File Size: {formatFileSize(video.fileSize)}
                </Typography>
                </div>
              <Button
                variant="contained"
                color="primary"
                sx={{mr:1, maxHeight: "35px"}}
                startIcon={<CloudDownloadIcon />}
                onClick={handleDownloadClick}
              >
                download
              </Button>
              </div>
              <div>
                <video controls width="full" className="mt-3 rounded-md">
                  <source src={video.videoPath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </>

          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
              <CircularProgress />
            </Box>
          )}
        </div>
      </Box>

      <Dialog open={confirmOpen} onClose={handleCancelConfirm} fullWidth maxWidth="xs">
            <DialogTitle>Download Video</DialogTitle>
            <DialogContent>
              <Typography sx={{ mt: 1 }}>
                Do you want to download this video?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelConfirm} color="inherit">Cancel</Button>
              <Button onClick={handleConfirmDownload} variant="contained" color="primary">
                Download
              </Button>
            </DialogActions>
      </Dialog>
    </>
  );
};

export default DetailViolenceVideosComponent;
