import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { WeeklyViodeosData, FilterWeeklyViodeos } from "../types/WeeklyVideosTypes";
import { getCurrentDate } from "@/constants/todayDate";
import moment from "moment"; 

const useDataWeeklyVideos = (filter?: FilterWeeklyViodeos) => {
  const [data, setData] = useState<WeeklyViodeosData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayDate = getCurrentDate();
  // const pastDate = moment().subtract(6, "days").format("YYYY-MM-DD");

  const fetchFilteredData = useCallback(async (filters: FilterWeeklyViodeos) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.camera?.length) {
        queryParams.append("camera", filters.camera.join(","));
      }
      if (filters.date) {
        queryParams.append("date", filters.date);
      }
      const response = await axios.get(`/api/weeklyVideos?${queryParams.toString()}`);
      setData(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilteredData(filter || { camera: [], date: todayDate });
  }, [filter, fetchFilteredData]);

  return { data, loading, error, refetch: fetchFilteredData };
};

export default useDataWeeklyVideos;
