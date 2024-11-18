import { useState, useEffect, useContext } from "react";
import { getUserSurveys } from "@services/apiService";
import { UserContext } from "@contexts/UserContext";

const useUserSurveys = () => {
  const [userSurveys, setUserSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken, newUserSurveys } = useContext(UserContext);

  const fetchUserSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching user surveys from apiService...");
      const response = await getUserSurveys(accessToken);
      setUserSurveys(response.filled_surveys);
    } catch (error) {
      console.error("Error loading user surveys:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    accessToken && fetchUserSurveys();
  }, [accessToken, newUserSurveys]);

  return { userSurveys, fetchUserSurveys, loading, error };
}

export default useUserSurveys;