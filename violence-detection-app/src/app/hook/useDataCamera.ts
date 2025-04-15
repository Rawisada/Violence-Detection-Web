import { useState, useEffect } from "react";
import axios from "axios";
import { CameraData } from "../types/CameraTypes";


const useDataCamera = () => {
  const [data, setData] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchCameras = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/camera`);
      const sortedData = response.data?.data?.sort((a: CameraData, b: CameraData) => a.camera - b.camera);
      setData(sortedData);
      setError(null);
    } catch (error) {
      setError("Failed to fetch camera data.");
    } finally {
      setLoading(false);
    }
  };


  const fetchCameraStatus = async (cameraId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/camera?camera=${cameraId}`);
      if (response.data.success && response.data.data.length > 0) {
        return response.data.data[0].status as boolean;
      }
      return false; 
    } catch (error) {
      console.error("Failed to fetch camera status:", error);
      return false; 
    }
  };

  
  const updateCameraStatus = async (camera: number, status: boolean) => {
    try {
      await axios.put(`/api/camera/${camera}`, { status });
      await fetchCameras();
    } catch (error) {
      console.error("Failed to update camera status:", error);
    }
  };

  const deleteCamera = async (camera: number) => {
    try {
      await axios.delete(`/api/camera/${camera}`);
      setData((prevData) => prevData.filter((cam) => cam.camera !== camera));
    } catch (error) {
      console.error("Failed to delete camera:", error);
    }
  };

  useEffect(() => {
    fetchCameras(); 
  }, []);

  return { data, loading, error, fetchCameras, fetchCameraStatus, updateCameraStatus, deleteCamera };
};

export default useDataCamera;