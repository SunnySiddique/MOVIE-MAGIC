import { useAPI } from "../context/APIContext";

const CastCrewCard = ({ displayType, member }) => {
  const { imageUrl } = useAPI();

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
        <div className="relative">
          {member.profile_path ? (
            <img
              className="w-full h-48 object-cover"
              src={imageUrl + member.profile_path}
              alt={member.name}
            />
          ) : (
            <div className="bg-neutral-800 font-bold h-48 w-full flex justify-center items-center text-bold text-white">
              No Image Found
            </div>
          )}

          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
            {displayType === "cast"
              ? member.known_for_department
              : member.department}
          </div>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {member.name}
          </h3>
          <p className="text-base text-gray-600 mb-2">
            as{" "}
            <span className="font-medium">
              {displayType === "cast" ? member.character : member.job}
            </span>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Popularity:{" "}
            <span className="font-bold">{member.popularity.toFixed(1)}</span>
          </p>
          {displayType === "crew" && (
            <p className="text-sm text-gray-500">
              Credit ID: <span className="font-bold">{member.credit_id}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CastCrewCard;
