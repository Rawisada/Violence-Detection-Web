import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { WeeklyViodeosData } from "../types/WeeklyVideosTypes";
import { formatDate, formatFileSize } from "@/lib/formate";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
interface DetailWeeklyVideosComponentProps {
  videoName: string;
}

const DetailWeeklyVideosComponent: React.FC<DetailWeeklyVideosComponentProps> = ({ videoName }) => {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<WeeklyViodeosData | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`/api/weeklyVideos?videoName=${videoName}`);
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

  return (
    <Box 
      sx={{ p: 3, 
        minHeight:"92.8vh",
        backgroundColor: "#fafafa",
      }}>
      <Button onClick={() => router.back()} sx={{ mb: 1 }}>
        <ChevronLeftIcon/>Back
      </Button>
      <Typography variant="h5" sx={{ color: 'black', fontWeight: 'medium', paddingLeft: 2}}>Video Details</Typography>
      <div className="px-44">
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : video ? (
          <>
            <div className="flex justify-between">
              <div>
              <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                Camera NO: CAM {video.camera}
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                Date: {formatDate(video.date)}
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', fontWeight: 'medium' }}>
                File Size: {formatFileSize(video.fileSize)}
              </Typography>
              </div>
            <Button
              variant="contained"
              color="primary"
              sx={{ my: 2, mr:1}}
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                if (video.videoPath) {
                  const link = document.createElement("a");
                  link.href = video.videoPath;
                  link.setAttribute("download", video.videoName || "video.mp4");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              
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
          <Typography>Loading video...</Typography>
        )}
      </div>
    </Box>
  );
};

export default DetailWeeklyVideosComponent;
