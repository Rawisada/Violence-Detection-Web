import { useState, useEffect } from "react";
import axios from "axios";
import { ViolenceData } from "../types/ViolenceVideosTypes";

const useDataViolenceVideosAll = () => {
  const [data, setData] = useState<ViolenceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataAll = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/violence`);
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
    fetchDataAll(); // ต้องใส่วงเล็บเพื่อให้มันรัน
  }, []);

  return { data, loading, error, fetchDataAll };
};

export default useDataViolenceVideosAll;
