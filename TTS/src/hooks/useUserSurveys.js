import { useState, useEffect } from "react";
import { getUserSurveys } from "@services/apiService";

const useUserSurveys = () => {
  const [userSurveys, setUserSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUserSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching user surveys from apiService...");
      const response = await getUserSurveys();
      setUserSurveys(response.filled_surveys);
    } catch (error) {
      console.error("Error loading user surveys:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSurveys();
  }, []);

  return { userSurveys, fetchUserSurveys, loading, error };
}

export default useUserSurveys;