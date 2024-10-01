import { AnimatePresence, motion } from "framer-motion"; // Add animation for smooth effects
import { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAPI } from "../context/APIContext";
import useNavigationVisibility from "../hooks/useNavigationVisibility";
import CarouselButton from "./CarouselButton";

const CastPage = ({ castData, handleViewAll }) => {
  const { imageUrl } = useAPI();
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const navigationEnabled = useNavigationVisibility(640);

  if (!castData) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div className="container mx-auto py-10 px-5">
      <motion.h2
        className="text-[27px] md:text-[36px] font-extrabold mb-10 text-slate-100"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ lineHeight: "32px" }}
      >
        Meet the Performers & Creators
      </motion.h2>
      {castData?.length > 0 ? (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <style>
            {`
          .swiper-slide {
            width: 100%;
          }
          @media (min-width: 768px) {
            .swiper-slide {
              width: 100%;
            }
          }
          @media (min-width: 1024px) {
            .swiper-slide {
              width: 33.33%;
            }
          }
        `}
          </style>
          <div className="relative">
            {" "}
            {/* Added a relative div to contain buttons */}
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={30}
              loop={true}
              navigation={false}
              modules={[Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="relative"
            >
              {castData.slice(0, 8).map((cast, index) => (
                <SwiperSlide key={`${cast.id}-${index}`}>
                  <motion.div
                    className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                  >
                    <div className="relative">
                      {cast.profile_path ? (
                        <img
                          className="w-full h-56 object-cover"
                          src={imageUrl + cast.profile_path}
                          alt={`Profile of ${cast.name}`}
                        />
                      ) : (
                        <div
                          className="bg-neutral-800 h-56 w-full flex justify-center items-center text-lg text-white"
                          role="img"
                          aria-label="No Image Found"
                        >
                          No Image Found
                        </div>
                      )}
                      <div
                        className={`absolute top-2 right-2 px-3 py-1 rounded-md text-sm font-semibold shadow-lg ${
                          cast.known_for_department === "Acting"
                            ? "bg-yellow-400 text-black"
                            : "bg-blue-400 text-white"
                        }`}
                      >
                        {cast.known_for_department}
                      </div>
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-md md:text-xl font-bold text-gray-900 mb-1">
                        {cast.name}
                      </h3>
                      <p className="text-base text-gray-600 mb-2">
                        as{" "}
                        <span className="font-semibold">{cast.character}</span>
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Popularity:{" "}
                        <span className="font-bold text-green-600">
                          {cast.popularity.toFixed(1)}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            <AnimatePresence>
              {isHovering && activeIndex > 0 && (
                <CarouselButton
                  direction="prev"
                  onClick={() => swiperRef.current?.slidePrev()}
                  isVisible={navigationEnabled}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10"
                />
              )}
            </AnimatePresence>
            <CarouselButton
              direction="next"
              onClick={() => swiperRef.current?.slideNext()}
              isVisible={navigationEnabled}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10"
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No cast information available.
        </p>
      )}
      <div className="mt-8">
        <motion.button
          onClick={handleViewAll}
          aria-label="View all cast and crew members"
          className="focus:ring-4 focus:ring-blue-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          View All Cast & Crew
        </motion.button>
      </div>
    </div>
  );
};

export default CastPage;
