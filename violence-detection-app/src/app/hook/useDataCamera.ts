import { useState, useEffect } from "react";
import axios from "axios";
import { CameraData } from "../types/CameraTypes";


const useDataCamera = () => {
  const [data, setData] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCamera = await axios.get(`http://localhost:3000/api/camera`);
        const sortedData = responseCamera.data?.data?.sort((a: CameraData, b: CameraData) => a.camera - b.camera);

        setData(sortedData);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useDataCamera;
