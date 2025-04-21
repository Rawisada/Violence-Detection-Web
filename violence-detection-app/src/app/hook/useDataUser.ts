import { useState, useEffect } from "react";
import axios from "axios";
import { UserData } from "../types/UsersType";

const useDataUser = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      setData(response.data.data); 
      setError(null);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (email: string): Promise<UserData | null> => {
    try {
      const response = await axios.get(`/api/users?email=${encodeURIComponent(email)}`);
      return response.data.data; 
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserData>) => {
    try {
        await axios.put(`/api/users/${userId}`, updates);
        await fetchAllUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      await fetchAllUsers(); 
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return {
    data,
    loading,
    error,
    fetchAllUsers,
    fetchUser,
    updateUser,
    deleteUser,
  };
};

export default useDataUser;
