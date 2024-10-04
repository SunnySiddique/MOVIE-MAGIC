import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Film,
  Home,
  LogOut,
  Search,
  Tv,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import profilePic from "../assets/images/profile-pic.jpg";
import { useAuthentication } from "../context/AuthenticationContext";
import { APIinstance } from "../main";

export default function Header() {
  const [searchParams] = useSearchParams();
  const { currentUser, logoutUser } = useAuthentication();
  const [searchInput, setSearchInput] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("Genres");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const genreDropdownRef = useRef(null);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchInput(query);
    const matchedGenre = genres.find(
      (genre) => genre.name.toLowerCase() === query.toLowerCase()
    );

    setSelectedGenre(matchedGenre ? matchedGenre.name : "Genres");

    // Reset search input when navigating to a new path
    if (location.pathname === "/movie" || location.pathname === "/tv") {
      setSearchInput(""); // Clear the search input
    }
  }, [location, genres]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await APIinstance.get("/genre/movie/list");
        setGenres(res.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target)
      ) {
        setShowGenreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === "") {
      setSelectedGenre("Genres");
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleGenreClick = (genreName) => {
    setSelectedGenre(genreName);
    navigate(`/search?q=${encodeURIComponent(genreName)}`);
    setShowGenreDropdown(false);
  };

  const toggleGenreDropdown = () => {
    setShowGenreDropdown(!showGenreDropdown);
  };

  console.log(currentUser);
  return (
    <>
      <header className="fixed top-0 w-full z-[99] bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 ">
          <div className="flex justify-between items-center py-4 md:py-3 sm:py-4">
            <div className="items-center space-x-4 hidden md:flex lg:flex">
              <Link to="/" className="flex items-center space-x-2">
                <Film className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">
                  MovieMagic
                </span>
              </Link>

              <nav className="flex space-x-4">
                <Link
                  to="/movie"
                  className={`hover:text-white transition-colors px-3 py-2 rounded-lg font-bold ${
                    isActive("/movie") ? "text-white" : "text-gray-300"
                  }`}
                >
                  Movies
                </Link>
                <Link
                  to="/tv"
                  className={`hover:text-white transition-colors px-3 py-2 rounded-lg font-bold ${
                    isActive("/tv") ? "text-white" : "text-gray-300"
                  }`}
                >
                  TV Shows
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <div className="relative" ref={genreDropdownRef}>
                <button
                  className="bg-white/10 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg flex items-center text-sm"
                  onClick={toggleGenreDropdown}
                  aria-haspopup="true"
                  aria-expanded={showGenreDropdown}
                >
                  {selectedGenre} <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <AnimatePresence>
                  {showGenreDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-30 max-h-60 overflow-y-auto"
                    >
                      {genres.map((genre) => (
                        <motion.button
                          key={genre.id}
                          onClick={() => handleGenreClick(genre.name)}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            selectedGenre === genre.name
                              ? "bg-gray-100 text-blue-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          role="menuitem"
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {genre.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <form
                onSubmit={handleSubmit}
                className="relative flex-grow sm:flex-grow-0"
              >
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleChange}
                  className="w-full sm:w-48 px-3 py-1 sm:py-2 rounded-full bg-white/10 border-none text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-3 bg-white/20 rounded-r-full"
                  aria-label="Search"
                >
                  <Search className="text-white h-4 w-4" />
                </button>
              </form>
              {currentUser && (
                <div className="relative hidden sm:block">
                  <button
                    className="cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-haspopup="true"
                    aria-expanded={showUserMenu}
                  >
                    <img
                      src={currentUser.photoURL || profilePic}
                      alt={currentUser.displayName || "User's profile"}
                      className="w-[50px] h-[50px] rounded-full"
                    />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                        role="menu"
                      >
                        <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          {currentUser.displayName}
                        </p>
                        <button
                          onClick={() => {
                            logoutUser();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <LogOut className="inline-block mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 md:hidden z-20">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`text-white flex flex-col items-center`}>
            <Home
              className={`h-6 w-6 ${isActive("/") ? "text-[#E94560]" : ""}`}
            />
            <span
              className={`text-xs mt-1 ${
                isActive("/") ? "text-[#E94560]" : ""
              }`}
            >
              Home
            </span>
          </Link>
          <Link to="/movie" className={`text-white flex flex-col items-center`}>
            <Film
              className={`h-6 w-6 ${
                isActive("/movie") ? "text-[#E94560]" : ""
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                isActive("/movie") ? "text-[#E94560]" : ""
              }`}
            >
              Movies
            </span>
          </Link>
          <Link to="/tv" className="text-white flex flex-col items-center">
            <Tv
              className={`h-6 w-6 ${isActive("/tv") ? "text-[#E94560]" : ""}`}
            />
            <span
              className={`text-xs mt-1 ${
                isActive("/tv") ? "text-[#E94560]" : ""
              }`}
            >
              TV Shows
            </span>
          </Link>
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-white flex flex-col items-center"
                aria-haspopup="true"
                aria-expanded={showUserMenu}
              >
                <img
                  src={currentUser.photoURL || profilePic}
                  alt={currentUser.displayName || "User's profile"}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs mt-1">Profile</span>
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 left-1/2 transform -translate-x-1/2"
                    role="menu"
                  >
                    <p className="px-4 py-2 text-sm text-gray-700">
                      {currentUser.displayName}
                    </p>
                    <button
                      onClick={() => {
                        logoutUser();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <LogOut className="inline-block mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="text-white flex flex-col items-center">
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Login</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
