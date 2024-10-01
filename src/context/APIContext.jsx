import { createContext, useContext, useEffect, useState } from "react";
import { APIinstance } from "../main";

const APIContext = createContext();
export const useAPI = () => useContext(APIContext);

const APIProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch video data based on movie ID
  const fetchVideos = async (movieId) => {
    setLoading(true);
    try {
      const res = await APIinstance.get(`/movie/${movieId}/videos`);
      return res.data.results; // Return videos
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      return []; // Return an empty array on error
    }
  };

  // Fetch trending movies
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await APIinstance.get("/trending/all/day");
      const trendingMovies = res.data.results;

      // Create a new array to hold movies with videos
      const moviesWithVideos = [];

      // Fetch videos for each movie one by one
      for (const movie of trendingMovies) {
        const videos = await fetchVideos(movie.id);
        moviesWithVideos.push({ ...movie, videos });
      }

      setData(moviesWithVideos);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch configuration for image URLs
  const fetchImages = async () => {
    try {
      const res = await APIinstance.get("/configuration");
      setImageUrl(res.data.images.secure_base_url + "original");
    } catch (error) {
      setError(error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchImages();
  }, []);

  const value = {
    data,
    imageUrl,
    error,
    loading,
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

export default APIProvider;
