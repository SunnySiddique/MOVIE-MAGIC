import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FullBackdropsImagesInfo from "./FullBackdropsImagesInfo";
import FullPostersImagesInfo from "./FullPostersImagesInfo";
import FullVideosInfo from "./FullVideosInfo";
import MovieDetailHeader from "./MovieDetailHeader";
import Loader from "./loader/Loader";

const AllVideosAndPosters = () => {
  const location = useLocation();
  const {
    imagesData,
    movieVideosData,
    selectedTab,
    movieDetails,
    imageLoading,
    movieLoading,
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageLoading || movieLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [imageLoading, movieLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <MovieDetailHeader movieDetails={movieDetails} />
      <div className="container mx-auto p-5">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-4">
            All {selectedTab?.charAt(0).toUpperCase() + selectedTab?.slice(1)}
          </h1>

          {selectedTab === "posters" && imagesData?.posters?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {imagesData.posters.map((item, index) => (
                <FullPostersImagesInfo
                  key={`${item.id}-${index}`}
                  postersData={item}
                />
              ))}
            </div>
          )}

          {selectedTab === "backdrops" && imagesData?.backdrops?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {imagesData.backdrops.map((item, index) => (
                <FullBackdropsImagesInfo
                  key={`${item.id}-${index}`}
                  backdropsData={item}
                />
              ))}
            </div>
          )}

          {selectedTab === "videos" && movieVideosData?.results?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {movieVideosData.results.map((item, index) => (
                <FullVideosInfo key={`${item.id}-${index}`} videosData={item} />
              ))}
            </div>
          )}

          {/* No data messages */}
          {selectedTab === "posters" &&
            (!imagesData || imagesData.posters.length === 0) && (
              <p>No posters available.</p>
            )}
          {selectedTab === "backdrops" &&
            (!imagesData || imagesData.backdrops.length === 0) && (
              <p>No backdrops available.</p>
            )}
          {selectedTab === "videos" &&
            (!movieVideosData || movieVideosData.results.length === 0) && (
              <p>No videos available.</p>
            )}
        </div>
      </div>
    </>
  );
};

export default AllVideosAndPosters;
