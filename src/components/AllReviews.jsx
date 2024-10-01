import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAPI } from "../context/APIContext";
import Divider from "./Divider";
import MovieDetailHeader from "./MovieDetailHeader";
import Loader from "./loader/Loader";

const AllReviews = () => {
  const location = useLocation();
  const { reviewsData, movieDetails, isLoading } = location.state || {};
  const { imageUrl } = useAPI();
  const [expandedReviewIds, setExpandedReviewIds] = useState({});
  const [reviewIsLoading, setReviewIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setReviewIsLoading(true);
    } else {
      setReviewIsLoading(false);
    }
  }, [isLoading]);

  const toggleExpandReview = (reviewId) => {
    setExpandedReviewIds((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  if (reviewIsLoading) {
    return <Loader />;
  }
  return (
    <>
      <MovieDetailHeader movieDetails={movieDetails} />
      <div className="container mx-auto p-5 space-y-5">
        {reviewsData?.length === 0 ? (
          <p className="text-neutral-400">No reviews available.</p>
        ) : (
          reviewsData?.map((review) => {
            const { avatar_path, name, username, rating } =
              review.author_details;
            const avatarUrl = avatar_path
              ? avatar_path.startsWith("/https")
                ? avatar_path.substring(1) // External avatar URL
                : `${imageUrl}${avatar_path}` // TMDB avatar URL
              : `https://ui-avatars.com/api/?name=${username}&background=random`; // Default avatar

            const isExpanded = expandedReviewIds[review.id];
            const reviewContent = isExpanded
              ? review.content
              : review.content.length > 300
              ? `${review.content.substring(0, 300)}...`
              : review.content;

            return (
              <div key={review.id}>
                <div className="bg-neutral-800 p-5 rounded-lg gap-4">
                  <div className="flex flex-col">
                    <img
                      src={avatarUrl}
                      alt={`${username}'s avatar`}
                      className="w-12 h-12 rounded-full flex justify-center ml-auto mr-auto mt-0 mb-0 md:m-0"
                    />
                    <h4 className="text-lg font-bold text-white text-center md:text-start">
                      {name || username}
                    </h4>
                    {rating && (
                      <p className="text-yellow-500 text-center md:text-start">
                        Rating: {rating}/10
                      </p>
                    )}
                  </div>

                  <div className="text-center md:text-start">
                    <p className="text-neutral-400 mt-2 text-justify">
                      {reviewContent}
                    </p>
                    {review.content.length > 300 && (
                      <button
                        className="text-blue-500 underline mt-1"
                        onClick={() => toggleExpandReview(review.id)}
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                    <p className="text-neutral-500 text-sm mt-1">
                      Posted on{" "}
                      {moment(review.created_at).format("MMM Do YYYY")}
                    </p>
                  </div>
                </div>
                <Divider />
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default AllReviews;
