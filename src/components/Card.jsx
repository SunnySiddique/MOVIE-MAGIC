import { motion } from "framer-motion";
import { FaCalendarAlt, FaStar } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { useAPI } from "../context/APIContext";
import CircularProgressBar from "./CircularProgressBar";

const Card = ({ data, trending, media_type = "movie" }) => {
  const { imageUrl } = useAPI();
  const backgroundImage = imageUrl + (data.poster_path || data.backdrop_path);
  const mediaType = data.media_type || media_type;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the animation of child elements
      },
    },
  };

  // Animation variants for each item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        className="relative max-w-full md:max-w-[300px] md:min-w-[250px] w-full h-80 overflow-hidden rounded-lg shadow-lg bg-gray-900 group cursor-pointer"
        variants={itemVariants}
      >
        {data?.poster_path ? (
          <img
            src={backgroundImage}
            alt={data.title || data.name}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-neutral-800 h-full w-full flex justify-center items-center text-bold text-white">
            No Image Found
          </div>
        )}

        {trending && (
          <div className="absolute top-2 left-2 w-12 h-12">
            <div className="relative flex justify-center items-center">
              <CircularProgressBar
                percentage={Math.round(data.vote_average * 10)}
              />
            </div>
          </div>
        )}

        {/* Overlay and Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-800 to-transparent opacity-90 transition-transform transform translate-y-full group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex flex-col justify-end h-full p-6 text-white">
            <div className="flex flex-col items-center">
              <h3 className="text-2xl text-center font-extrabold mb-4 bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent uppercase overflow-hidden">
                {data.title || data.name}
              </h3>

              {/* Rating and Release Date */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-full px-3 py-1">
                  <FaStar className="text-yellow-200 text-lg" />
                  {data.vote_average && (
                    <span className="text-sm font-medium">
                      {data.vote_average && data.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full px-3 py-1">
                  <FaCalendarAlt className="text-white text-lg" />
                  <span className="text-sm">
                    {data.release_date || data.first_air_date}
                  </span>
                </div>
              </div>
            </div>
            <Link
              to={`/${mediaType}/${data.id}`}
              className="flex justify-center items-center"
            >
              <button className="mt-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                More Details
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card;
