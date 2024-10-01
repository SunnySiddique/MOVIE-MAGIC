import { useState } from "react";
import { FaChartLine, FaStar } from "react-icons/fa"; // Importing icons
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAPI } from "../context/APIContext";
import VideoModal from "./VideoModal"; // Assuming you have this component
import Loader from "./loader/Loader";

const HomeBanner = () => {
  const { data, imageUrl, loading } = useAPI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);

  const handlePlayNowClick = (videoKey) => {
    setSelectedVideoKey(videoKey);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideoKey(null);
  };

  const modalData = {
    isModalOpen,
    handleCloseModal,
    selectedVideoKey,
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        grabCursor={true}
        slidesPerView={1}
        loop={true}
      >
        {data?.map((bannerData, i) => {
          const trailerKey = bannerData.videos.find(
            (video) =>
              video.type === "Trailer" ||
              video.type === "Teaser" ||
              video.type === "Clip"
          )?.key;

          return (
            <SwiperSlide key={i}>
              <div className="w-full h-[100vh]">
                <HeroSlideItem
                  item={bannerData}
                  imageUrl={imageUrl}
                  trailerKey={trailerKey}
                  onPlayNowClick={() =>
                    trailerKey && handlePlayNowClick(trailerKey)
                  }
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <VideoModal modalData={modalData} />
    </section>
  );
};

function HeroSlideItem({ item, imageUrl, onPlayNowClick, trailerKey }) {
  const background = item.backdrop_path
    ? imageUrl + item.backdrop_path
    : imageUrl + item.poster_path;

  return (
    <div className="relative w-full h-full">
      <img
        src={background}
        alt=""
        className="absolute inset-0 w-full h-full object-cover filter brightness-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="relative flex flex-col justify-center items-center w-full h-full p-6 lg:p-12 text-center text-white">
        <div className="absolute bottom-12 lg:bottom-[7rem] max-w-lg px-6 py-8 bg-gradient-to-r from-black via-transparent to-black rounded-lg shadow-lg">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-2xl capitalize">
            {item.title || item.original_title || item.name}
          </h2>
          <p className="text-lg lg:text-xl font-medium mb-6 line-clamp-3">
            {item.overview}
          </p>
          <div className="flex flex-wrap justify-center mb-6 space-x-4">
            <span className="flex items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-md transform hover:scale-105 transition-transform">
              <FaStar className="mr-2 text-yellow-300" />
              Rating:{" "}
              {Number(item.vote_average ? item.vote_average.toFixed(1) : "N/A")}
            </span>
            <span className="flex items-center bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md transform hover:scale-105 transition-transform">
              <FaChartLine className="mr-2 text-green-200" />
              Popularity: {item.popularity ? item.popularity.toFixed(0) : "N/A"}
            </span>
            <span className="mt-3 flex items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md transform hover:scale-105 transition-transform">
              <FaChartLine className="mr-2 text-blue-200" />
              Release Date: {item.release_date || "N/A"}
            </span>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-xl lg:text-2xl font-semibold mb-4">
              Discover the best of entertainment
            </p>
            <div className="flex justify-center space-x-4">
              {trailerKey && (
                <button
                  className="bg-red-600 hover:bg-red-700 px-8 py-4 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  onClick={onPlayNowClick}
                >
                  Play Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
