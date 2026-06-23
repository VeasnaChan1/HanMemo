import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios";

/**
 * Custom hook for managing standardized async GET requests with Axios
 * @param {string} url - API endpoint relative to base URL
 * @param {Array} dependencies - Dependency array to trigger automated re-fetch cycles
 * @returns {Object} { data, loading, error, refetch, setData }
 */
const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the request handler to allow users to trigger programmatic manual refreshes (e.g., pulling to refresh)
  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (err) {
      console.error(`[useFetch Error] Error hitting ${url}:`, err);
      // Capture detailed server message if available, otherwise fall back to raw message
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected network error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Handle automatic request lifecycle executions when URL or bound hook dependencies shift state
  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData, // Expose setter for optimistic UI state modifications
  };
};

export default useFetch;
