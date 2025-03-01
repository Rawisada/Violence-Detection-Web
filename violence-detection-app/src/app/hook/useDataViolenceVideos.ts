import { useState, useEffect } from "react";
import axios from "axios";
import { ViolenceData, FilterViolenceVideos } from "../types/ViolenceVideosTypes";
import { getCurrentDate } from "@/constants/todayDate";

const useDataViolenceVideos = (filter?: FilterViolenceVideos) => {
  const [data, setData] = useState<ViolenceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const todayDate = getCurrentDate();
  const fetchFilteredData = async (filters: FilterViolenceVideos) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.camera.length > 0) {
        queryParams.append("camera", filters.camera.join(","));
      }
      if (filters.date) {
        queryParams.append("date", filters.date);
      }
      if (filters.type.length > 0) {
        queryParams.append("type", filters.type.join(","));
      }

      const response = await axios.get(`http://localhost:3000/api/violence?${queryParams.toString()}`);
      setData(response.data.data); 
      setError(null); 
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter) {
      fetchFilteredData(filter);
    } else {
      fetchFilteredData({ camera: [], date: todayDate, type: [] });
    }
  }, [filter]);

  return { data, loading, error, refetch: fetchFilteredData }
};

export default useDataViolenceVideos;
