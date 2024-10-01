import moment from "moment";
import { useLocation } from "react-router-dom"; // To retrieve passed state
import galleryImage from "../assets/images/gallery.svg";
import { useAPI } from "../context/APIContext";
import Divider from "./Divider";
import MovieDetailHeader from "./MovieDetailHeader";

const DisplayAllSeason = () => {
  const { imageUrl } = useAPI();
  const location = useLocation();
  const {
    seasons,
    movieTitle,
    latestSeasonNumber,
    episodes,
    latestEpisode,
    movieDetails,
  } = location.state;
  return (
    <>
      <MovieDetailHeader movieDetails={movieDetails} />
      <div className="container mx-auto p-5">
        <div className="py-1">
          {seasons.map((season, index) => (
            <div key={`${season.id}-${index}`}>
              <div className="border-2 border-neutral-500 bg-gradient-to-br from-gray-800 to-black rounded-md flex flex-col md:flex-row gap-4 mb-5 relative ">
                {/* Outer glowing border effect */}
                {/* <div className="absolute inset-0 border-4 border-yellow-500 rounded-md blur-md opacity-50"></div> */}

                <div className="p-0 pl-0 md:pt-[1.5rem] md:pb-[1.5rem] md:pl-[1.5rem] md:pr-0">
                  {season.poster_path ? (
                    <div className="w-full h-[10rem] md:h-auto md:w-[5rem]">
                      <img
                        src={imageUrl + season.poster_path}
                        alt={`${name} Poster`}
                        className="w-full h-full object-cover rounded-md shadow-md relative z-10"
                      />
                    </div>
                  ) : (
                    <div className="bg-black h-32 md:h-auto md:bg-transparent rounded-md flex justify-center items-center w-full md:w-24">
                      <img
                        src={galleryImage}
                        alt=""
                        className="w-24 h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 relative z-10 p-6 md:pt-[1.5rem] md:pr-[1.5rem] md:pb-[1.5rem] md:pl-0">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-lg font-bold text-yellow-300">
                      {season.name}
                    </h4>{" "}
                    {/* Title in light yellow */}
                    <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded">
                      {Math.round(season.vote_average * 10)}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 font-bold">
                    {season.air_date
                      ? moment(season.air_date).format("YYYY")
                      : "Unknown Year"}{" "}
                    • {season.episode_count} Episodes
                  </p>

                  {season.overview ? (
                    <p className="text-[16px] text-justify text-slate-300 font-semibold mt-2">
                      {season.overview}
                    </p>
                  ) : (
                    <p className="text-2xl text-slate-300   font-semibold mt-2">
                      Season {latestSeasonNumber} of {movieTitle} premiered on{" "}
                      {moment(season.air_date).format("MMMM D, YYYY")}.
                    </p>
                  )}

                  {/* Latest Episode Information */}
                  {latestEpisode && (
                    <div className="mt-4">
                      <p className="font-semibold text-yellow-400">
                        Latest Episode
                      </p>
                      <p className="text-gray-400">
                        Episode {episodes.length}: {latestEpisode.name} •{" "}
                        {moment(latestEpisode.air_date).format("MMMM D, YYYY")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayAllSeason;
