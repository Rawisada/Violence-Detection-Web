import { useState, useEffect } from "react";
import axios from "axios"; // หรือ Fetch API ก็ได้

interface ViolenceData {
  id: number;
  videoName: string;
  type: number; 
  date: string;
  time: string;
  videoPath: string;
  camera: number
}

const useViolenceData = () => {
  const [data, setData] = useState<ViolenceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayDate = getCurrentDate();
        const response = await axios.get(`http://localhost:3000/api/violence?date=${todayDate}`); 
        setData(response.data.data); 
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useViolenceData;
