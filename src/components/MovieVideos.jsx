import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useNavigationVisibility from "../hooks/useNavigationVisibility";
import CarouselButton from "./CarouselButton";
import ErrorText from "./ErrorText";
import VideoModal from "./VideoModal";
import VideoPlayer from "./VideoPlayer";

const MovieVideos = ({ movieVideosData, handleViewAllClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);

  // Function to handle play button click
  const handlePlayClick = (videoKey) => {
    setSelectedVideoKey(videoKey);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideoKey(null);
  };

  const modalData = {
    handleCloseModal,
    handlePlayClick,
    isModalOpen,
    selectedVideoKey,
  };

  const navigationEnabled = useNavigationVisibility(640);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      className="mt-5 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>
        {`
          .swiper-slide {
            width: 80%;
          }
          @media (min-width: 768px) {
            .swiper-slide {
              width: 50%;
            }
          }
          @media (min-width: 1024px) {
            .swiper-slide {
              width: 33.33%;
            }
          }
        `}
      </style>
      {movieVideosData.results.length < 1 ? (
        <ErrorText msg={"We’re sorry, but there are no videos at this time"} />
      ) : (
        <>
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            modules={[Navigation]}
            navigation={false}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="relative"
          >
            {movieVideosData?.results?.slice(0, 5).map((video) => (
              <SwiperSlide key={video.id}>
                <VideoPlayer
                  thumbnail={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  onPlayClick={() => handlePlayClick(video.key)}
                />
              </SwiperSlide>
            ))}

            {movieVideosData?.results?.length > 4 && (
              <SwiperSlide className="w-4/5 md:w-1/2 lg:w-1/3">
                <div
                  className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center"
                  onClick={handleViewAllClick}
                >
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    View All
                  </button>
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {movieVideosData?.results?.length > 4 && (
            <>
              <AnimatePresence>
                {isHovering && activeIndex > 0 && (
                  <CarouselButton
                    direction="prev"
                    onClick={() => swiperRef.current?.slidePrev()}
                    isVisible={navigationEnabled}
                    // top="calc(50% - 35px)" // Adjust as necessary
                    // transform="translateY(-50%)"
                  />
                )}
              </AnimatePresence>

              <CarouselButton
                direction="next"
                onClick={() => swiperRef.current?.slideNext()}
                isVisible={navigationEnabled}
                // top="calc(50% - 35px)" // Adjust as necessary
                // transform="translateY(-50%)"
              />
            </>
          )}
          <VideoModal modalData={modalData} />
        </>
      )}
    </div>
  );
};

export default MovieVideos;
