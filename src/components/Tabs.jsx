"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaFilm, FaPlayCircle, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useFetchDetails from "../hooks/useFetchDetails";
import BackDropsImages from "./BackDropsImages";
import MostPopular from "./MostPopular";
import MovieVideos from "./MovieVideos";
import PostersImages from "./PostersImages";

const Tabs = ({ movieDetails }) => {
  const { explore, id } = movieDetails.movieDetailsId;
  const navigate = useNavigate();
  const [isTabShow, setIsTabShow] = useState("tab1");
  const { data: imagesData, isLoading: imageLoading } = useFetchDetails(
    `/${explore}/${id}/images`
  );
  const { data: movieVideosData, isLoading: movieLoading } = useFetchDetails(
    `/${explore}/${id}/videos`
  );

  const mostPopularVideo = movieVideosData?.results?.find(
    (video) =>
      video.type === "Trailer" ||
      video.type === "Teaser" ||
      video.type === "Clip"
  );

  const getTabName = () => {
    switch (isTabShow) {
      case "tab2":
        return "Videos";
      case "tab3":
        return "Backdrops";
      case "tab4":
        return "Posters";
      default:
        return "";
    }
  };

  const handleViewAllClick = () => {
    const tabName = getTabName().toLowerCase();
    navigate(`/allVideosAndPosters/${tabName}`, {
      state: {
        imagesData,
        movieVideosData,
        selectedTab: tabName,
        movieDetails,
        imageLoading,
        movieLoading,
      },
    });
  };

  const tabs = [
    { id: "tab1", label: "Most Popular", icon: <FaStar className="w-4 h-4" /> },
    {
      id: "tab2",
      label: "Videos",
      icon: <FaPlayCircle className="w-4 h-4" />,
      count: movieVideosData?.results?.length,
    },
    {
      id: "tab3",
      label: "Backdrops",
      icon: <FaFilm className="w-4 h-4" />,
      count: imagesData?.backdrops?.length,
    },
    {
      id: "tab4",
      label: "Posters",
      icon: <FaFilm className="w-4 h-4" />,
      count: imagesData?.posters?.length,
    },
  ];

  return (
    <div className="mt-[40px] mb-[100px]">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-100">Media</h1>
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-1 rounded-xl shadow-2xl">
          <nav className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 p-2 w-full sm:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setIsTabShow(tab.id)}
                  className={`relative px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isTabShow === tab.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isTabShow === tab.id
                            ? "bg-white text-purple-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </span>
                  {isTabShow === tab.id && (
                    <motion.div
                      layoutId="bubble"
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
            {isTabShow !== "tab1" && (
              <div className="p-2">
                <button
                  onClick={handleViewAllClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 ease-in-out"
                >
                  View All {getTabName()}
                </button>
              </div>
            )}
          </nav>
        </div>

        {isTabShow === "tab1" && (
          <MostPopular
            movieVideosData={movieVideosData}
            mostPopularVideo={mostPopularVideo}
            postersData={imagesData}
          />
        )}
        {isTabShow === "tab2" && (
          <MovieVideos
            movieVideosData={movieVideosData}
            handleViewAllClick={handleViewAllClick}
          />
        )}
        {isTabShow === "tab3" && (
          <BackDropsImages
            backdropsData={imagesData}
            handleViewAllClick={handleViewAllClick}
          />
        )}
        {isTabShow === "tab4" && (
          <PostersImages
            postersData={imagesData}
            handleViewAllClick={handleViewAllClick}
          />
        )}
      </div>
    </div>
  );
};

export default Tabs;
