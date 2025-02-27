// 📁 src/hooks/useDataVideoStorage.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface ViolenceData {
  id: number;
  videoName: string;
  type: number; 
  date: string;
  time: string;
  videoLink: string;
  camera: number
}

const useDataVideoStorage = () => {
  const [data, setData] = useState<ViolenceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/violence`);
        setData(response.data.data); // 📌 ค่าที่ดึงจะเป็น type = 1, 2, 3
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

export default useDataVideoStorage;
