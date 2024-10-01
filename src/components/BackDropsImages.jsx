import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAPI } from "../context/APIContext";
import useNavigationVisibility from "../hooks/useNavigationVisibility";
import CarouselButton from "./CarouselButton"; // Import the CarouselButton component
import ErrorText from "./ErrorText";

export default function BackDropsImages({ backdropsData, handleViewAllClick }) {
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
      {backdropsData?.backdrops?.length < 1 ? (
        <ErrorText
          msg={"We’re sorry, but there are no backdrops at this time"}
        />
      ) : (
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={30}
          modules={[Navigation]}
          navigation={false} // Disable default navigation
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="relative"
        >
          {backdropsData?.backdrops?.slice(0, 10).map((backdrop, index) => (
            <SwiperSlide key={index} className="w-4/5 md:w-1/2 lg:w-1/3">
              <div className="relative aspect-video">
                <img
                  src={`${imageUrl}${backdrop.file_path}`}
                  alt={`Backdrop ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}
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
        </Swiper>
      )}

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
    </div>
  );
}
