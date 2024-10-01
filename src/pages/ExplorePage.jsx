import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Loader from "../components/loader/Loader"; // Ensure this is your loading component
import { APIinstance } from "../main";

const ExplorePage = () => {
  const [data, setData] = useState([]);
  const params = useParams();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const currentPage = useRef(1);

  const fetchData = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await APIinstance.get(`/discover/${params.explore}`, {
        params: { page: pageNumber },
      });
      setData((prevData) => [...prevData, ...res.data.results]);
      setHasMore(pageNumber < res.data.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.explore) {
      currentPage.current = 1;
      setData([]);
      fetchData(currentPage.current);
    }
  }, [params?.explore]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      currentPage.current += 1;
      fetchData(currentPage.current);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pt-20 p-4">
      <div className="container mx-auto">
        <h3 className="capitalize text-4xl md:text-3xl my-5 font-semibold text-white hover:text-gray-300 drop-shadow-lg">
          Popular {params?.explore}
        </h3>

        {loading && currentPage.current > 1 && <Loader />}
        {hasMore && loading && currentPage.current > 1 && <Loader />}

        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center md:justify-start items-center">
            {data.map((exploreData, index) => (
              <Card
                key={`${exploreData.id}-${index}`}
                data={exploreData}
                media_type={params?.explore}
              />
            ))}
          </div>
        </div>

        {hasMore && !loading && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
