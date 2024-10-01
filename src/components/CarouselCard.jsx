import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useNavigationVisibility from "../hooks/useNavigationVisibility";
import Card from "./Card";
import CarouselButton from "./CarouselButton";

const CarouselCard = ({ data = [], heading, trending, media_type }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const navigationEnabled = useNavigationVisibility(640);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  return (
    <div className="container mx-auto my-10 p-4">
      <h2 className="text-2xl lg:text-4xl font-extrabold mb-5 drop-shadow-2xl">
        {heading}
      </h2>
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
                  width: 33.33%;
                }
              }
    
              @media (min-width: 992px) {
                /* For large devices like laptops/desktops */
                .swiper-slide {
                  width: 33.33%;
                }
              }
              @media (min-width: 1200px) {
                /* For large devices like laptops/desktops */
                .swiper-slide {
                  width: 23.33%;
                }
              }
            `}
        </style>
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
          {data.map((item) => (
            <SwiperSlide key={item.id}>
              <Card data={item} trending={trending} media_type={media_type} />
            </SwiperSlide>
          ))}
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
      </div>
    </div>
  );
};

export default CarouselCard;
