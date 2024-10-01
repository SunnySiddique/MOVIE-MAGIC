import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CarouselCard from "../components/CarouselCard";
import CastPage from "../components/CastPage";
import DetailContent from "../components/DetailContent";
import ErrorText from "../components/ErrorText";
import Keywords from "../components/Keywords";
import Loader from "../components/loader/Loader";
import Reviews from "../components/Reviews";
import Season from "../components/Season";
import Tabs from "../components/Tabs";
import VideoModal from "../components/VideoModal";
import useFetchDetails from "../hooks/useFetchDetails";

const DetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);

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
    isModalOpen,
    selectedVideoKey,
  };

  const { data: detailData, isLoading } = useFetchDetails(
    `/${params?.explore}/${params?.id}`
  );
  const { data: creditsData, isLoading: creditIsLoading } = useFetchDetails(
    `/${params?.explore}/${params?.id}/credits`
  );
  const { data: keywordsData } = useFetchDetails(
    `/${params?.explore}/${params?.id}/keywords`
  );
  const { data: reviewsData, isLoading: reviewIsLoading } = useFetchDetails(
    `/${params?.explore}/${params?.id}/reviews`
  );
  const { data: movieVideosData } = useFetchDetails(
    `/${params?.explore}/${params?.id}/videos`
  );
  const { data: similarMovieData } = useFetchDetails(
    `/${params?.explore}/${params?.id}/similar`
  );
  const { data: recommendationsMovieData } = useFetchDetails(
    `/${params?.explore}/${params?.id}/recommendations`
  );

  const handleViewAll = () => {
    navigate(`/fullCastAndCrew`, {
      state: {
        castData: creditsData?.cast,
        crewData: creditsData?.crew,
        creditIsLoading: creditIsLoading,
        movieDetails: {
          movieDetailsId: params,
          movieTitle: detailData.title || detailData.name,
          movieYear: moment(detailData.release_date).format("YYYY"),
          moviePoster: detailData.poster_path,
        },
      },
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!detailData)
    return (
      <ErrorText
        msg={"We’re sorry, but there are no data at this time"}
        height="100vh"
        justifyCenter="center"
      />
    );

  const mostPopularVideo = movieVideosData?.results?.find(
    (video) =>
      video.type === "Trailer" ||
      video.type === "Teaser" ||
      video.type === "Clip"
  );

  return isLoading ? (
    <Loader />
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <DetailContent
          detailData={detailData}
          mostPopularVideo={mostPopularVideo}
          handlePlayClick={handlePlayClick}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Keywords
            keywords={keywordsData?.results || keywordsData?.keywords}
          />
          <CastPage
            castData={creditsData?.cast}
            handleViewAll={handleViewAll}
          />
          <Season
            seasons={detailData.seasons}
            movieTitles={detailData.title || detailData.name}
            movieDetails={{
              movieDetailsId: params,
              movieTitle: detailData.title || detailData.name,
              movieYear: moment(detailData.release_date).format("YYYY"),
              moviePoster: detailData.poster_path,
            }}
          />
          <Reviews
            reviewsData={reviewsData?.results || []}
            movieDetails={{
              isLoading: reviewIsLoading,
              movieDetailsId: params,
              movieTitle: detailData.title || detailData.name,
              movieYear: moment(detailData.release_date).format("YYYY"),
              moviePoster: detailData.poster_path,
            }}
          />
          <Tabs
            movieDetails={{
              movieDetailsId: params,
              movieTitle: detailData.title || detailData.name,
              movieYear: moment(detailData.release_date).format("YYYY"),
              moviePoster: detailData.poster_path,
            }}
          />

          <AnimatePresence>
            {similarMovieData?.results?.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                <CarouselCard
                  heading={"Similar Movies"}
                  data={similarMovieData?.results || []}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {recommendationsMovieData?.results?.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
              >
                <CarouselCard
                  heading={"Recommendations"}
                  data={recommendationsMovieData?.results || []}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <VideoModal modalData={modalData} />
    </motion.div>
  );
};

export default DetailPage;
