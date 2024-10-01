import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import ErrorText from "../components/ErrorText";
import Loader from "../components/loader/Loader";
import { APIinstance } from "../main";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const currentPage = useRef(1);

  const fetchSearchResults = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await APIinstance.get(`/search/multi`, {
        params: {
          query: searchParams.get("q"),
          page: pageNumber,
        },
      });
      setSearchResults((prev) => [...prev, ...(response.data.results || [])]);
      setHasMore(pageNumber < response.data.total_pages);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    currentPage.current = 1;
    setSearchResults([]);
    fetchSearchResults(currentPage.current);
  }, [searchParams]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      currentPage.current += 1;
      fetchSearchResults(currentPage.current);
    }
  };

  const searchQuery = searchParams.get("q");

  if (!searchResults) {
    return (
      <ErrorText
        height="100vh"
        justifyCenter="center"
        msg={
          "Oops! No results found right now. Check back soon for fresh updates!"
        }
      />
    );
  }

  return (
    <div className="container mx-auto pt-20 md:pt-24 p-5">
      <h2 className="text-2xl font-bold mb-5 capitalize">
        Search Results for: {searchQuery || "..."}
      </h2>

      {loading && currentPage.current > 1 && <Loader />}
      {hasMore && loading && currentPage.current > 1 && <Loader />}

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center md:justify-start items-center">
          {searchResults.map((searchData, index) => (
            <div key={`${searchData.id}-${index}`}>
              <Card data={searchData} media_type={searchData.media_type} />
            </div>
          ))}
        </div>
      )}

      {/* Load More button */}
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
  );
};

export default SearchPage;
