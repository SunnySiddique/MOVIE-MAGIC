import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAPI } from "../context/APIContext";

const MostPopular = ({ mostPopularVideo, postersData }) => {
  const { imageUrl } = useAPI();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const youtubeThumbnail = mostPopularVideo
    ? `https://img.youtube.com/vi/${mostPopularVideo.key}/hqdefault.jpg`
    : null;

  return (
    <div className="mt-5">
      <style>
        {`
          .swiper-slide {
            width: 80%;
          }

          @media (min-width: 768px) {
            /* For medium devices like tablets */
            .swiper-slide {
              width: 50%;
            }
          }

          @media (min-width: 1024px) {
            /* For large devices like laptops/desktops */
            .swiper-slide {
              width: 33.33%;
            }
          }
        `}
      </style>
      <Swiper slidesPerView={"auto"} spaceBetween={30} grabCursor={true}>
        {/* Conditionally render the video slide only if mostPopularVideo exists */}
        {mostPopularVideo && (
          <SwiperSlide>
            <div
              className="relative w-full"
              style={{
                paddingTop: "56.25%", // This ensures the container has a 16:9 aspect ratio (9/16 = 0.5625)
                backgroundImage: `url(${youtubeThumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative cursor-pointer"
                  onClick={handlePlayClick}
                >
                  <div className="w-16 h-16 bg-[rgba(0,0,0,.7)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    <FaPlay />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black opacity-30 pulse-animation"></div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}

        {postersData?.backdrops?.slice(0, 3).map((backdrop, index) => (
          <SwiperSlide key={index}>
            <div className="w-full relative">
              <img
                src={`${imageUrl}${backdrop.file_path}`}
                alt={`Poster ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-0 right-0"
                onClick={handleCloseModal}
              >
                <FaX className="flex justify-center items-center w-7 h-7 bg-[rgba(0,0,0,.7)] p-[6px] rounded-bl-lg" />
              </button>
              <iframe
                className="w-full h-[50vh]"
                src={`https://www.youtube.com/embed/${mostPopularVideo?.key}`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MostPopular;
