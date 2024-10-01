import { Link } from "react-router-dom";
import { useAPI } from "../context/APIContext";

const MovieDetailHeader = ({ movieDetails }) => {
  const { imageUrl } = useAPI();
  return (
    <>
      <div className="mt-20 mb-8 bg-gray-800 p-3 shadow-lg border border-gray-600">
        {/* Movie Poster */}
        <div className="container mx-auto flex items-center gap-4">
          {movieDetails?.moviePoster && (
            <img
              src={imageUrl + movieDetails?.moviePoster}
              alt={movieDetails?.movieTitle}
              className="w-20 h-24 object-cover rounded-lg shadow-md border-2 border-gray-500 transition-transform duration-300 hover:scale-105"
            />
          )}
          {/* Movie Title and Year */}
          <div>
            <h1 className="text-3xl font-bold text-white">
              {movieDetails?.movieTitle}{" "}
              <span className="text-yellow-400">
                ({movieDetails?.movieYear || "2024"})
              </span>
            </h1>
            <Link
              to={`/${movieDetails?.movieDetailsId?.explore}/${movieDetails?.movieDetailsId?.id}`}
              className="text-gray-400 hover:text-gray-300 transition duration-300"
            >
              ← Back to main
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailHeader;
