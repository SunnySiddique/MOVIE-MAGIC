import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAPI } from "../context/APIContext";
import useNavigationVisibility from "../hooks/useNavigationVisibility";
import CarouselButton from "./CarouselButton";
import ErrorText from "./ErrorText";

const PostersImages = ({ postersData, handleViewAllClick }) => {
  const { imageUrl } = useAPI();
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

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
      {postersData.posters.length > 1 ? (
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
            {postersData?.posters?.slice(0, 20).map((poster, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-[300px] min-h-[300px] relative">
                  <img
                    src={`${imageUrl}${poster.file_path}`}
                    alt={`Poster ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}

            <SwiperSlide className="w-4/5 md:w-1/2 lg:w-1/3">
              <div className="w-full h-[300px] min-h-[300px] aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  onClick={handleViewAllClick}
                >
                  View All
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
          {/* Custom Previous Button */}
          <AnimatePresence>
            {isHovering && activeIndex > 0 && (
              <CarouselButton
                direction="prev"
                onClick={() => swiperRef.current?.slidePrev()}
                isVisible={navigationEnabled}
              />
            )}
          </AnimatePresence>
          {/* Custom Next Button */}
          <CarouselButton
            direction="next"
            onClick={() => swiperRef.current?.slideNext()}
            isVisible={navigationEnabled}
          />
        </>
      ) : (
        <ErrorText msg={"We’re sorry, but there are no posters at this time"} />
      )}
    </div>
  );
};

export default PostersImages;
