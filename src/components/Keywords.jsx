import { useNavigate } from "react-router-dom";
import Divider from "./Divider";

const Keywords = ({ keywords }) => {
  const navigate = useNavigate();

  const handleKeywordClick = (keyword) => {
    navigate(`/search?q=${encodeURIComponent(keyword.name)}`);
  };

  return (
    <div className=" my-10">
      <h3 className="text-2xl font-bold">Keywords</h3>
      <Divider />
      <div className="flex flex-wrap gap-2">
        {keywords && keywords.length > 0 ? (
          keywords.map((keyword) => (
            <button
              key={keyword.id}
              onClick={() => handleKeywordClick(keyword)}
              className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
            >
              {keyword.name}
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center my-8 p-4 bg-gray-900 rounded-lg shadow-md">
            <h1 className="text-[28px] md:text-3xl font-bold text-red-500 mb-2">
              🔍 No Keywords Found
            </h1>
          </div>
        )}
      </div>
      <Divider />
    </div>
  );
};

export default Keywords;
