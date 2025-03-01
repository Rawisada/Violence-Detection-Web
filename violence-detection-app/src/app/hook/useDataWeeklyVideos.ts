import { useState, useEffect } from "react";
import axios from "axios";
import { WeeklyViodeosData, FilterWeeklyViodeos } from "../types/WeeklyVideosTypes";
import { getCurrentDate } from "@/constants/todayDate";

const useDataWeeklyVideos = (filter?: FilterWeeklyViodeos) => {
  const [data, setData] = useState<WeeklyViodeosData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const todayDate = getCurrentDate();
  const fetchFilteredData = async (filters: FilterWeeklyViodeos) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.camera.length > 0) {
        queryParams.append("camera", filters.camera.join(","));
      }
      if (filters.date) {
        queryParams.append("date", filters.date);
      }

      const response = await axios.get(`http://localhost:3000/api/weeklyVideos?${queryParams.toString()}`);
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
      fetchFilteredData({ camera: [], date: todayDate});
    }
  }, [filter]);

  return { data, loading, error, refetch: fetchFilteredData }
};

export default useDataWeeklyVideos;
