import { Loader } from "lucide-react";
import { useEffect, useState } from "react"; // Use state to toggle between cast and crew
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import CastCrewCard from "./CastCrewCard";
import MovieDetailHeader from "./MovieDetailHeader";

const FullCastCrewDisplay = () => {
  const location = useLocation();
  const { castData, crewData, movieDetails, creditIsLoading } =
    location.state || {};
  const [displayType, setDisplayType] = useState("cast");

  // Data to display based on displayType
  const dataToDisplay = displayType === "cast" ? castData : crewData;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading state based on creditIsLoading
    setIsLoading(creditIsLoading);
  }, [creditIsLoading]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <MovieDetailHeader movieDetails={movieDetails} />
      <div className="container mx-auto px-5">
        {/* Toggle Buttons for Cast and Crew */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 font-bold ${
              displayType === "cast"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            } rounded-md`}
            onClick={() => setDisplayType("cast")}
          >
            Show Cast
          </button>
          <button
            className={`px-4 py-2 font-bold ${
              displayType === "crew"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            } rounded-md`}
            onClick={() => setDisplayType("crew")}
          >
            Show Crew
          </button>
        </div>

        {/* Render Cast or Crew */}
        <h2 className="text-3xl font-bold mb-6">
          {displayType === "cast" ? "All Cast" : "All Crew"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataToDisplay?.map((member, index) => (
            <CastCrewCard
              key={`${member.id}-${index}`}
              displayType={displayType}
              member={member}
            />
          ))}
        </div>

        <Link
          to={`/${movieDetails?.movieDetailsId?.explore}/${movieDetails?.movieDetailsId?.id}`}
          className="text-center flex justify-center items-center mt-4"
        >
          <button className="mt-4 bg-slate-200 text-black px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 font-bold flex items-center gap-2 mb-3">
            <span>
              <FaArrowLeft />
            </span>{" "}
            Back to main
          </button>
        </Link>
      </div>
    </>
  );
};

export default FullCastCrewDisplay;
