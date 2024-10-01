import moment from "moment";
import { FaEye } from "react-icons/fa"; // Importing icons
import { useNavigate } from "react-router-dom";
import galleryImage from "../assets/images/gallery.svg";
import { useAPI } from "../context/APIContext";

const Season = ({ seasons, movieTitle, movieDetails }) => {
  const { imageUrl } = useAPI();
  const navigate = useNavigate();

  const currentSeason =
    seasons?.find((season) => season.overview) || seasons?.[seasons.length - 1];

  if (!currentSeason) return null;

  const {
    poster_path,
    name,
    vote_average,
    air_date,
    episode_count,
    overview,
    episodes,
  } = currentSeason;

  const latestEpisode = episodes?.[episodes.length - 1];
  const latestSeasonNumber = seasons[seasons.length - 1].season_number;

  const handleViewAllSeasons = () => {
    navigate("/allSeasons", {
      state: {
        seasons,
        movieTitle,
        latestSeasonNumber,
        episodes,
        latestEpisode,
        movieDetails,
      },
    });
  };

  return (
    <div className=" ">
      <h3 className="text-4xl font-bold text-white mb-4">Current Season</h3>
      <div>
        <div className="border-4 border-transparent bg-gradient-to-br from-gray-800 to-black rounded-md shadow-md flex flex-col md:flex-row gap-4 mb-5 relative">
          {/* Outer glowing border effect */}
          <div className="absolute inset-0 border-4 border-yellow-500 rounded-md blur-md opacity-50"></div>
          <div className="p-0 pl-0 md:pt-[1.5rem] md:pb-[1.5rem] md:pl-[1.5rem] pr-0">
            {currentSeason.poster_path ? (
              <div className="w-full h-[10rem] md:h-auto md:w-[5rem]">
                <img
                  src={imageUrl + poster_path}
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

          <div className="flex-1 relative z-10 p-6  md:pt-[1.5rem] md:pr-[1.5rem] md:pb-[1.5rem]">
            <div className="flex justify-between mb-2">
              <h4 className="text-lg font-bold text-yellow-300">{name}</h4>{" "}
              {/* Title in light yellow */}
              <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded">
                {Math.round(vote_average * 10)}%
              </span>
            </div>

            <p className="text-sm text-gray-400 font-bold">
              {air_date ? moment(air_date).format("YYYY") : "Unknown Year"} •{" "}
              {episode_count} Episodes
            </p>

            {currentSeason.overview ? (
              <p className="text-[16px] text-justify text-slate-300 font-semibold mt-2">
                {overview}
              </p>
            ) : (
              <p className="text-2xl text-slate-300   font-semibold mt-2">
                Season {latestSeasonNumber} of {movieTitle} premiered on{" "}
                {moment(air_date).format("MMMM D, YYYY")}.
              </p>
            )}

            {/* Latest Episode Information */}
            {latestEpisode && (
              <div className="mt-4">
                <p className="font-semibold text-yellow-400">Latest Episode</p>
                <p className="text-gray-400">
                  Episode {episodes.length}: {latestEpisode.name} •{" "}
                  {moment(latestEpisode.air_date).format("MMMM D, YYYY")}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleViewAllSeasons}
          className="mt-4 bg-yellow-500 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-200 cursor-pointer flex items-center justify-center"
        >
          <FaEye className="mr-2" /> View All Seasons
        </button>
      </div>
    </div>
  );
};

export default Season;
