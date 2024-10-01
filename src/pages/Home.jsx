import CarouselCard from "../components/CarouselCard";
import HomeBanner from "../components/HomeBanner";
import { useAPI } from "../context/APIContext";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const { data: trendingData } = useAPI();
  const { data: nowPlayingData } = useFetch("/movie/now_playing");
  const { data: popularTvShowData } = useFetch("/tv/popular");
  const { data: topRatedData } = useFetch("/movie/top_rated");
  const { data: upComingData } = useFetch("/movie/upcoming");
  const { data: onTheAirData } = useFetch("/tv/on_the_air");

  return (
    <>
      <HomeBanner />
      <CarouselCard data={trendingData} heading={"Trending"} trending={true} />
      <CarouselCard
        data={nowPlayingData}
        heading={"Now Playing"}
        media_type="movie"
      />
      <CarouselCard
        data={popularTvShowData}
        heading={"Popular Tv Show"}
        media_type="tv"
      />
      <CarouselCard data={topRatedData} heading={"Top Rated"} media_type="tv" />
      <CarouselCard
        data={upComingData}
        heading={"UpComing"}
        media_type="movie"
      />
      <CarouselCard
        data={onTheAirData}
        heading={"On The Air"}
        media_type="tv"
      />
    </>
  );
};

export default Home;
