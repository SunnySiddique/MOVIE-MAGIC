import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  Globe,
  List,
  Play,
  Star,
  TrendingUp,
  Tv,
} from "lucide-react";
import moment from "moment";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";
import Divider from "../components/Divider";
import { useAPI } from "../context/APIContext";

const DetailContent = ({ detailData, handlePlayClick, mostPopularVideo }) => {
  const { imageUrl } = useAPI();
  const navigate = useNavigate();

  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleGenreClick = (genre) => {
    navigate(`/search?q=${encodeURIComponent(genre.name)}`);
  };

  const languageMap = {
    en: "English",
    hi: "Hindi",
    fr: "French",
    es: "Spanish",
    de: "German",
    ja: "Japanese",
    ko: "Korean",
    pt: "Portuguese",
    ru: "Russian",
    ar: "Arabic",
    it: "Italian",
  };

  return (
    <>
      <div className="relative h-[60vh] lg:h-[80vh] overflow-hidden">
        <motion.img
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          src={imageUrl + detailData?.backdrop_path}
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 -mt-48 lg:-mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/3"
          >
            <Tilt>
              <img
                src={imageUrl + detailData?.poster_path}
                className="w-full rounded-lg shadow-2xl"
                alt="Poster"
              />
            </Tilt>
            {mostPopularVideo && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-6 bg-red-600 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-colors duration-300 hover:bg-red-700"
                onClick={() => handlePlayClick(mostPopularVideo.key)}
              >
                <Play className="w-6 h-6" />
                <span>Watch Trailer</span>
              </motion.button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:w-2/3"
          >
            <h1 className="text-[32px] lg:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {detailData.title || detailData.name || detailData.original_name}
            </h1>
            <p className="text-xl text-gray-400 italic mb-6">
              {detailData.tagline}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {detailData.vote_average && (
                <InfoItem
                  icon={<Star className="w-6 h-6 text-yellow-400" />}
                  text={`${Number(detailData.vote_average).toFixed(
                    1
                  )} (${Number(detailData.vote_count).toLocaleString()} votes)`}
                />
              )}
              <InfoItem
                icon={<Clock className="w-6 h-6 text-blue-400" />}
                text={formatRuntime(
                  detailData.runtime || detailData.episode_run_time
                )}
              />
              {detailData.release_date && (
                <InfoItem
                  icon={<Calendar className="w-6 h-6 text-green-400" />}
                  text={moment(detailData.release_date).format("MMM Do YYYY")}
                />
              )}
              {detailData.revenue !== 0 && (
                <InfoItem
                  icon={<DollarSign className="w-6 h-6 text-pink-400" />}
                  text={`$${Number(detailData.revenue).toLocaleString()}`}
                />
              )}
              {detailData.popularity && (
                <InfoItem
                  icon={<TrendingUp className="w-6 h-6 text-orange-400" />}
                  text={`Popularity: ${Number(detailData.popularity).toFixed(
                    0
                  )}`}
                />
              )}
              {detailData.number_of_seasons && (
                <InfoItem
                  icon={<Tv className="w-6 h-6 text-purple-400" />}
                  text={`${detailData.number_of_seasons} Seasons`}
                />
              )}

              {detailData.number_of_episodes && (
                <InfoItem
                  icon={<List className="w-6 h-6 text-blue-400" />}
                  text={`${detailData.number_of_episodes} Episodes`}
                />
              )}
            </div>

            <Divider />

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {detailData.overview}
              </p>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <DetailItem label="Status" value={detailData.status} />
              {detailData.revenue !== 0 && (
                <DetailItem
                  label="Revenue"
                  value={`$${Number(detailData.revenue).toLocaleString()}`}
                />
              )}
              <DetailItem
                label="Original Language"
                value={
                  languageMap[detailData.original_language]
                    ? languageMap[detailData.original_language]
                    : detailData.original_language
                }
                text={true}
              />
              <DetailItem
                label="Production Countries"
                value={detailData.production_countries
                  .map((country) => country.name)
                  .join(", ")}
              />
              <DetailItem
                label="First Air Date"
                value={moment(detailData.first_air_date).format("MMM Do YYYY")}
              />
              <DetailItem
                label="Last Air Date"
                value={moment(detailData.last_air_date).format("MMM Do YYYY")}
              />
            </div>

            <Divider />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {detailData.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm transition-colors duration-300 hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleGenreClick(genre)}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <Divider />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Spoken Languages</h3>
              <div className="flex flex-wrap gap-2">
                {detailData.spoken_languages.map((language) => (
                  <span
                    key={language.iso_639_1}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm transition-colors duration-300 hover:bg-gray-600"
                  >
                    {language.name || language.english_name}
                  </span>
                ))}
              </div>
            </div>
            <Divider />

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Production Companies
              </h3>
              <div className="flex flex-wrap gap-4">
                {detailData.production_companies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 transition-transform duration-300 hover:scale-105"
                  >
                    {company.logo_path && (
                      <img
                        src={`${imageUrl}${company.logo_path}`}
                        alt={company.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span>{company.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {detailData.homepage && (
              <a
                href={detailData.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                <Globe className="w-5 h-5" />
                <span>Official Website</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DetailContent;

const InfoItem = ({ icon, text }) => (
  <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 transition-transform duration-300 hover:scale-105">
    {icon}
    <span>{text}</span>
  </div>
);

const DetailItem = ({ label, value, text }) => (
  <div>
    <h3 className="font-semibold text-gray-400">{label}</h3>
    {text ? (
      <p className="text-white uppercase">{value}</p>
    ) : (
      <p className="text-white">{value}</p>
    )}
  </div>
);
